local creator = Creator.new()

local isActiveCheck = bind(creator, 'isActive')

RegisterNuiHandler('creator:stop', bind(creator, 'stop'), isActiveCheck)

RegisterNuiHandler('rotation:start', bind(creator.rotator, 'start'), isActiveCheck)
RegisterNuiHandler('rotation:stop', bind(creator.rotator, 'stop'), isActiveCheck)

RegisterNuiHandler('appearance:reset', function()
    creator.appearance:reset()
    SendNUIMessage({
        eventName = "creator:update",
        payload = creator.appearance:getUiConfig()

    })
end, isActiveCheck)

RegisterNuiHandler('appearance:set-head-blend', function(payload)
    creator.appearance:setHeadBlend(PlayerPedId(), payload.index, payload.value / 100)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-parent', function(payload)
    creator.appearance:setParent(PlayerPedId(), payload.index, payload.value)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-ancestor', function(value)
    creator.appearance:setHeadBlend(PlayerPedId(), 3, value)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-gender', function(gender)
    creator.appearance:setGender(gender)
    SendNUIMessage({
        eventName = "creator:update",
        payload = creator.appearance:getUiConfig()

    })
end, isActiveCheck)

RegisterNuiHandler('appearance:set-face-feature', function(payload)
    creator.appearance:setFaceFeature(PlayerPedId(), payload.index, payload.value / 100)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-head-overlay-value', function(payload)
    creator.appearance:setHeadOverlayValue(PlayerPedId(), payload.index, payload.value)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-head-overlay-opacity', function(payload)
    creator.appearance:setHeadOverlayOpacity(PlayerPedId(), payload.index, payload.value / 100)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-head-overlay-color', function(payload)
    creator.appearance:setHeadOverlayColor(PlayerPedId(), payload.index, payload.value)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-eye-color', function(payload)
    SetPedEyeColor(PlayerPedId(), payload)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-hair-style', function(payload)
    creator.appearance:setPedHairStyle(PlayerPedId(), payload)
end, isActiveCheck)

RegisterNuiHandler('appearance:set-hair-color', function(payload)
    creator.appearance:setPedHairColor(PlayerPedId(), payload.primary, payload.secondary)
end, isActiveCheck)

RegisterNuiHandler('cam:point-at', function(payload)
    creator.camera:pointAt(payload)
end, isActiveCheck)

RegisterNUICallback('get-locale', function(data, cb)
    cb(GetResourceMetadata(GetCurrentResourceName(), 'locale', 0) or 'en')
end)

local function startCharacterCreator(config, cb)
    if creator:isActive() then
        error('Already using character creator')
    end

    creator:start(config, cb)
end

local function setAppearance(data)
    creator.appearance:set(data)
end

exports('startCharacterCreator', startCharacterCreator)
exports('setAppearance', setAppearance)

