local function isPromise(p)
    if type(p) ~= 'table' then
        return false
    end

    return type(p.next) == 'function' and type(p.state) == 'number' and type(p.queue) == 'table'
end

function RegisterNuiHandler(name, fn, isAvailabile)
    RegisterNUICallback(name, function(data, cb)
        if not isAvailabile() then
            return cb('fuckoff')
        end
        local success, result = pcall(fn, data)
        if isPromise(result) then
            success, result = pcall(Citizen.Await, result)
        end
        if not success then
            error(result)
        end
        return cb(result)
    end)
end

function bind(target, method)
    return function(...)
        return target[method](target, ...)
    end
end

MP_MODELS = {
    male = GetHashKey('mp_m_freemode_01'),
    female = GetHashKey('mp_f_freemode_01')
}

function SetModel(model)
    if not IsModelValid(model) then
        print("Invalid model specified.")
        return false
    end

    RequestModel(model)
    while not HasModelLoaded(model) do
        Citizen.Wait(0)
    end
    SetPlayerModel(PlayerId(), model)
    SetModelAsNoLongerNeeded(model)
    local ped = PlayerPedId()
    SetPedDefaultAppearance(ped)
    return true
end

function table.find(self, pred)
    for i, v in ipairs(self) do
        if pred(v, i) then
            return v
        end
    end
end

function table.findIndex(self, pred)
    for i, v in ipairs(self) do
        if pred(v, i) then
            return i
        end
    end
end

function table.merge(self, other)
    local ret = {}
    for k, v in pairs(self) do
        ret[k] = v
    end

    for k, v in pairs(other) do
        ret[k] = v
    end
    return ret
end

function table.fromLength(legth, fill)
    local ret = {}
    for i = 1, legth, 1 do
        table.insert(ret, fill(i))
    end
    return ret
end
