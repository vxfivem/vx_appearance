local Camera = {}
Camera.__index = Camera;

function Camera.new()
    local self = setmetatable({}, Camera)
    return self
end

function Camera:create()
    self.handle = CreateCam('DEFAULT_SCRIPTED_CAMERA', true)
end

function Camera:destroy()
    self:setActive(false)
    DestroyCam(self.hanlde, false)
end

function Camera:setActive(active)
    SetCamActive(self.handle, active)
    RenderScriptCams(active, false, 0, 0, 0)
end

function Camera:calculateOffsets(ped)
    local rot = GetEntityRotation(ped, 2)

    local head = {
        pos = GetOffsetFromEntityInWorldCoords(ped, 0.15, 0.55, 0.73),
        rot = rot - vec(12.0, 0.0, 180),
        fov = 50.0
    }

    local body = {
        pos = GetOffsetFromEntityInWorldCoords(ped, 0.15, 1.0, 0.5),
        rot = rot - vec(12.0, 0.0, 180),
        fov = 50.0
    }
    local legs = {
        pos = GetOffsetFromEntityInWorldCoords(ped, 0.15, 1.3, -0.1),
        rot = rot - vec(20.0, 0.0, 180),
        fov = 50.0
    }
    local feet = {
        pos = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.8, -0.5),
        rot = rot - vec(22.0, 0.0, 180),
        fov = 50.0
    }
    local full = {
        pos = GetOffsetFromEntityInWorldCoords(ped, -0.2, 2.0, 0.5),
        rot = rot - vec(16.0, 0.0, 180),
        fov = 50.0
    }

    self.offsets = {}
    self.offsets.full = full;
    self.offsets.head = head;
    self.offsets.body = body;
    self.offsets.legs = legs;
    self.offsets.feet = feet;
end

function Camera:pointAt(key)
    if not self.offsets then
        error('Offsets are not calculated')
    end

    local offset = self.offsets[key]

    if not offset then
        error(string.format('Unknown offest %s', key))
    end

    if self.currentPont == key then
        return
    end
    self.currentPoint = key

    local pos = offset.pos
    local rot = offset.rot
    local fov = offset.fov

    SetCamCoord(self.handle, pos)
    SetCamRot(self.handle, rot, 2)
    SetCamFov(self.handle, fov)
end

_G.Camera = Camera
