local INITIAL_POS = vec(402.9099, -996.9099, -100.000)
local INITIAL_HEADING = 180.0
local WORKING_HEADING = 154.0

local function loadImages()
    RequestStreamedTextureDict('pause_menu_pages_char_mom_dad')
    RequestStreamedTextureDict('char_creator_portraits')
    while not HasStreamedTextureDictLoaded('pause_menu_pages_char_mom_dad') or
        not HasStreamedTextureDictLoaded('char_creator_portraits') do
        Wait(100)
    end

end

local function unloadImages()
    SetStreamedTextureDictAsNoLongerNeeded('pause_menu_pages_char_mom_dad')
    SetStreamedTextureDictAsNoLongerNeeded('char_creator_portraits')
end

Creator = {}
Creator.__index = Creator

function Creator.new()
    local self = setmetatable({}, Creator)
    self.rotator = Rotator.new()
    self.camera = Camera.new()
    self.appearance = Appearance.new(INITIAL_POS, INITIAL_HEADING, WORKING_HEADING)

    self._pauseCookie = {
        isActive = false
    }

    return self
end

function Creator:start(config, callback)
    if self._isActive then
        return
    end
    config = config or {}
    DoScreenFadeOut(0)
    Wait(1000)

    loadImages()
    self.callback = callback

    local ped = PlayerPedId()
    self.initialAppearance = self.appearance:get(ped)
    self.initialPos = GetEntityCoords(ped)
    self.initialHeading = GetEntityHeading(ped)

    SetModel(MP_MODELS.male, true)
    ped = PlayerPedId()
    SetEntityVisible(ped, true, 0)
    SetEntityCoords(ped, INITIAL_POS)
    SetEntityHeading(ped, INITIAL_HEADING)
    FreezeEntityPosition(ped, true)
    local interior = GetInteriorAtCoords(GetEntityCoords(ped))
    while not HasCollisionLoadedAroundEntity(ped) and not IsInteriorReady(interior) do
        Wait(0)
    end
    SetPlayerControl(PlayerId(), false, 0)
    DisplayRadar(false)
    self.camera:create()
    self.camera:calculateOffsets(ped)
    self.camera:pointAt('head')
    self.camera:setActive(true)
    SetEntityHeading(ped, WORKING_HEADING)

    SetNuiFocus(true, true)
    SetNuiFocusKeepInput(true)

    self._isActive = true

    self._pauseCookie.isActive = true

    Citizen.CreateThread(function()
        local isPaused = not not IsPauseMenuActive()
        while self._pauseCookie.isActive do
            local isPausedNow = not not IsPauseMenuActive()
            if isPaused ~= isPausedNow then
                isPaused = isPausedNow
                SendNUIMessage({
                    eventName = 'game:isPaused',
                    payload = isPaused
                })
            end
            Wait(100)
        end
    end)
    DoScreenFadeIn(5000)
    Wait(500)
    SendNUIMessage({
        eventName = "creator:start",
        payload = table.merge({
            config = table.merge(config, {
                hairColors = table.fromLength(GetNumHairColors(), function(i)
                    return {
                        GetPedHairRgbColor(i - 1)
                    }
                end),
                makeupColors = table.fromLength(GetNumMakeupColors(), function(i)
                    return {
                        GetMakeupRgbColor(i - 1)
                    }
                end)
            })
        }, self.appearance:getUiConfig())
    })
end

function Creator:stop(identity)
    print(json.encode(identity, {
        indent = true
    }))
    self._pauseCookie.isActive = false
    self.rotator:stop()
    local ped = PlayerPedId()

    local currentAppearance = self.appearance:get(ped)

    self.appearance:set(self.initialAppearance)
    self.initialAppearance = nil
    self.camera:setActive(false)
    self.camera:destroy()
    unloadImages()
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    SendNUIMessage({
        eventName = "creator:stop"
    })
    ped = PlayerPedId()

    FreezeEntityPosition(ped, false)
    SetEntityCollision(ped, true, true)
    SetEntityVisible(ped, true)
    SetPlayerControl(PlayerId(), true, 0)
    self.callback(identity, currentAppearance)
    self.callback = nil
    self._isActive = false
    DisplayRadar(true)
    SetEntityCoords(ped, self.initialPos)
    SetEntityHeading(ped, self.initialHeading)
    self.initialHeading = nil
    self.initialPos = nil
end

function Creator:isActive()
    return self._isActive
end
