Rotator = {}
Rotator.__index = Rotator

function Rotator.new()
    local self = setmetatable({}, Rotator)
    self._isRunning = false
    return self
end

function Rotator:start()
    self:stop()
    self._isRunning = true
    Citizen.CreateThread(function()
        local x = GetNuiCursorPosition()
        while self._isRunning do
            local newX = GetNuiCursorPosition();
            local deltaX = newX - x
            x = newX
            SetEntityHeading(PlayerPedId(), GetEntityHeading(PlayerPedId()) + deltaX / 2.5)
            Wait(0)
        end
    end)
end

function Rotator:stop()
    if not self._isRunning then
        return
    end
    self._isRunning = false
end
