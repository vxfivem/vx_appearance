-- inspiration https://github.com/pitermcflebor/pmc-keybinds
local registeredKeys = {}

local function noop()

end

function RegisterKey(opts)
    local layout = opts.layout
    local keyname = opts.keyname
    local description = opts.description
    local onPress = opts.onPress or noop
    local onRelease = opts.onRelease or noop

    assert(type(layout) == 'string', 'Invalid Lua type, layout argument expected string')
    assert(type(keyname) == 'string', 'Invalid Lua type, keyname argument expected string')
    assert(type(description) == 'string', 'Invalid Lua type, description argument expected string')

    if not opts.onPress and not opts.onRelease then
        error('At least onPress or onRelease callback has to be provided')
    end

    if registeredKeys[layout] == nil then
        registeredKeys[layout] = {}
    end
    if registeredKeys[layout][keyname] == nil then
        registeredKeys[layout][keyname] = {}
    end
    local _isDisabled = false

    local disable = function(v)
        _isDisabled = v
    end

    local isDisabled = function()
        return _isDisabled
    end

    table.insert(registeredKeys[layout][keyname], {
        onPress = onPress,
        onRelease = onRelease,
        isDisabled = isDisabled,
        disable = disable
    })

    RegisterKeyMapping(('+keypress %s %s'):format(layout, keyname), description, layout:upper(), keyname:upper())
    return {
        layout = layout,
        keyname = keyname,
        isDisabled = isDisabled,
        disable = disable
    }
end

RegisterCommand('+keypress', function(s, args)
    local layout = args[1]
    local keyname = args[2]
    if not layout or not keyname then
        return
    end

    local layoutLower, keynameLower = layout:lower(), keyname:lower()
    local cbs = registeredKeys[layoutLower] and registeredKeys[layoutLower][keynameLower]
    if not cbs then
        return
    end
    for i, v in ipairs(cbs) do
        if not v.isDisabled() then
            v.onPress(layoutLower, keynameLower, 'press')
        end
    end
end, false)

RegisterCommand('-keypress', function(s, args)
    local layout = args[1]
    local keyname = args[2]
    if not layout or not keyname then
        return
    end

    local layoutLower, keynameLower = layout:lower(), keyname:lower()
    local cbs = registeredKeys[layoutLower] and registeredKeys[layoutLower][keynameLower]
    if not cbs then
        return
    end
    for i, v in ipairs(cbs) do
        if not v.isDisabled() then
            v.onRelease(layoutLower, keynameLower, 'release')
        end
    end

end, false)

