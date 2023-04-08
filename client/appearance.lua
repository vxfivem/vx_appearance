Appearance = {}
Appearance.__index = Appearance

local exp = exports[GetCurrentResourceName()]

local fathers, mothers = (function()
    local parents = json.decode(LoadResourceFile(GetCurrentResourceName(), 'configs/parents.json'))
    return parents.fathers, parents.mothers
end)()

local colorTypes = {
    [1] = 1,
    [2] = 1,
    [10] = 1,
    [5] = 2,
    [8] = 2
}

function SetPedDefaultAppearance(ped)
    local model = GetEntityModel(ped)
    if (model ~= MP_MODELS.female) and (model ~= MP_MODELS.male) then
        return
    end

    ClearAllPedProps(ped)
    SetPedDefaultComponentVariation(ped)
    SetPedHeadBlendData(ped, mothers[1].index, fathers[1].index, 0, mothers[1].index, fathers[1].index, 0, 0.5, 0.5,
        0.0, false)

    for i = 1, 20, 1 do
        SetPedFaceFeature(ped, i - 1, 0.0)
    end

    for i = 0, 12, 1 do
        SetPedHeadOverlayColor(ped, i, colorTypes[i] or 0, 0, 0)

        SetPedHeadOverlay(ped, i, 255, 1.0)
    end
    SetPedEyeColor(ped, 0)

    if model == MP_MODELS.male then
        SetPedComponentVariation(ped, 1, 0, 0, 0)
        SetPedComponentVariation(ped, 2, 0, 0, 0)
        SetPedComponentVariation(ped, 3, 15, 0, 0)
        SetPedComponentVariation(ped, 4, 61, 0, 0)
        SetPedComponentVariation(ped, 5, 0, 0, 0)
        SetPedComponentVariation(ped, 6, 34, 0, 0)
        SetPedComponentVariation(ped, 7, 0, 0, 0)
        SetPedComponentVariation(ped, 8, 15, 0, 0)
        SetPedComponentVariation(ped, 9, 0, 0, 0)
        SetPedComponentVariation(ped, 10, 0, 0, 0)
        SetPedComponentVariation(ped, 11, 15, 0, 0)
    else
        SetPedComponentVariation(ped, 1, 0, 0, 0)
        SetPedComponentVariation(ped, 2, 0, 0, 0)
        SetPedComponentVariation(ped, 3, 15, 0, 0)
        SetPedComponentVariation(ped, 4, 15, 0, 0)
        SetPedComponentVariation(ped, 5, 0, 0, 0)
        SetPedComponentVariation(ped, 6, 35, 0, 0)
        SetPedComponentVariation(ped, 7, 0, 0, 0)
        SetPedComponentVariation(ped, 8, 14, 0, 0)
        SetPedComponentVariation(ped, 9, 0, 0, 0)
        SetPedComponentVariation(ped, 10, 0, 0, 0)
        SetPedComponentVariation(ped, 11, 15, 0, 0)
    end
    exp:applyHeadOverlay(ped)
end

function Appearance.new(initialPosition, initialHeading, workingHeading)
    local self = setmetatable({}, Appearance)
    self.initialPosition = initialPosition
    self.initialHeading = initialHeading
    self.workingHeading = workingHeading
    return self
end

function Appearance:reset()
    SetPedDefaultAppearance(PlayerPedId())
end

function Appearance.getHeadblend(ped)
    ped = ped or PlayerPedId()
    local hb = {Citizen.InvokeNative(0x2746BD9D88C5C5D0, ped, Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0), Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0), Citizen.PointerValueIntInitialized(0),
        Citizen.PointerValueIntInitialized(0), Citizen.PointerValueFloatInitialized(0),
        Citizen.PointerValueFloatInitialized(0), Citizen.PointerValueFloatInitialized(0))}
    return hb;
end

function Appearance:setGender(gender)
    local model = MP_MODELS[gender]
    if not model then
        error(string.format('invalid gender %s', gender))
    end
    SetModel(model)
    SetPedDefaultAppearance(PlayerPedId())
end

function Appearance:getGender(ped)
    ped = ped or PlayerPedId()
    local model = GetEntityModel(ped)
    if model == MP_MODELS.male then
        return 'male'
    end

    if model == MP_MODELS.female then
        return 'female'
    end
end

function Appearance:setHeadBlend(ped, index, value)
    local hb = Appearance.getHeadblend(ped)
    value = value == 1 and 1.0 or value
    value = value == 0 and 0.0 or value
    hb[index] = value
    SetPedHeadBlendData(ped, table.unpack(hb))
end

function Appearance:setParent(ped, index, value)
    local hb = Appearance.getHeadblend(ped)
    local config
    if index == 1 then
        config = mothers
    elseif index == 2 then
        config = fathers
    end
    local parent = config[value].index
    hb[index] = parent
    hb[index + 3] = parent
    SetPedHeadBlendData(ped, table.unpack(hb))
end

function Appearance:getUiConfig()
    local ped = PlayerPedId()
    local hb = Appearance.getHeadblend(ped)
    local gender = Appearance:getGender(ped)

    local mother = table.findIndex(mothers, function(v, i)
        return v.index == hb[1]
    end)

    local father = table.findIndex(fathers, function(v, i)
        return v.index == hb[2]
    end)

    return {
        common = {
            gender = gender,
            eyeColor = GetPedEyeColor(ped)
        },
        headblend = {
            mother = mother - 1,
            father = father - 1,
            ancestor = hb[3],
            resemblance = math.floor(hb[7] * 100),
            skinMix = math.floor(hb[8] * 100),
            ancestorInfluence = math.floor(hb[9] * 100)
        },
        faceFeatures = self:getFaceFeaturesUI(ped),
        appearance = table.fromLength(13, function(i)
            local retval, overlayValue, colourType, firstColour, secondColour, overlayOpacity = GetPedHeadOverlayData(
                ped, i - 1)
            local color = ({firstColour, secondColour})[colourType]
            return {
                color = color,
                opacity = math.floor(overlayOpacity * 100),
                value = overlayValue == 255 and -1 or overlayValue
            }
        end),
        hair = {
            primaryColor = GetPedHairColor(ped),
            secondaryColor = GetPedHairHighlightColor(ped),
            max = GetNumberOfPedDrawableVariations(ped, 2),
            variation = GetPedDrawableVariation(ped, 2)
        }
    }
end

function Appearance:getFaceFeaturesUI(ped)
    return table.fromLength(20, function(i)
        local ff = GetPedFaceFeature(ped, i)
        return math.floor(ff * 100)
    end)
end

function Appearance:setFaceFeature(ped, index, value)
    value = value + 0.0
    SetPedFaceFeature(ped, index, value)
end

function Appearance:setHeadOverlayValue(ped, index, value)
    local _, _, _, _, _, overlayOpacity = GetPedHeadOverlayData(ped, index)
    value = value == -1 and 255 or value
    SetPedHeadOverlay(ped, index, value, overlayOpacity)
end

function Appearance:setHeadOverlayOpacity(ped, index, opacity)
    local _, value = GetPedHeadOverlayData(ped, index)
    SetPedHeadOverlay(ped, index, value, opacity + 0.0)
end

function Appearance:setHeadOverlayColor(ped, index, color)
    local colorType = colorTypes[index]
    if not colorType then
        return nil
    end
    SetPedHeadOverlayColor(ped, index, colorType, color, color)
end

function Appearance:setPedHairStyle(ped, style)
    SetPedComponentVariation(ped, 2, style, 0, 0)
    exp:applyHeadOverlay(ped)
end

function Appearance:setPedHairColor(ped, primary, secondary)
    SetPedHairColor(ped, primary, secondary)
    exp:applyHeadOverlay(ped)
end
