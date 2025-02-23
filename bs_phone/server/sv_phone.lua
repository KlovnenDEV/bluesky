local defaultSettings = {
  wallpaper = 'wallpaper',
  brand = 'android',
  notifications = true,
}

AddEventHandler('Phone:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
  Fetch = exports['bs_base']:FetchComponent('Fetch')
  Database = exports['bs_base']:FetchComponent('Database')
  Callbacks = exports['bs_base']:FetchComponent('Callbacks')
  Logger = exports['bs_base']:FetchComponent('Logger')
  Utils = exports['bs_base']:FetchComponent('Utils')
  Chat = exports['bs_base']:FetchComponent('Chat')
  Phone = exports['bs_base']:FetchComponent('Phone')
  Middleware = exports['bs_base']:FetchComponent('Middleware')
  Wallet = exports['bs_base']:FetchComponent('Wallet')
end

AddEventHandler('Core:Shared:Ready', function()
  exports['bs_base']:RequestDependencies('Phone', {
    'Fetch',
    'Database',
    'Callbacks',
    'Logger',
    'Utils',
    'Chat',
    'Phone',
    'Middleware',
    'Wallet',
  }, function(error)
    if #error > 0 then return end -- Do something to handle if not all dependencies loaded
    RetrieveComponents()
    -- DefaultData()
    TriggerEvent('Phone:Server:RegisterMiddleware')
    TriggerEvent('Phone:Server:RegisterCallbacks')
  end)
end)

RegisterServerEvent('Characters:Server:Spawn')
AddEventHandler('Characters:Server:Spawn', function()
  local char = Fetch:Source(source):GetData('Character')
  if not char:GetData('PhoneSettings') then char:SetData('PhoneSettings', defaultSettings) end
  local cash = 0

  Wallet:Get(char, function(wallet)
    if wallet then
      cash = wallet.cash
    end
  end)

  local src = char:GetData('Source')
  TriggerClientEvent('Phone:Client:Settings', src, char:GetData('PhoneSettings'))
  TriggerClientEvent('Phone:Client:SetData', src, {
    sid = src,
    cid = char:GetData('ID'),
    phoneNumber = char:GetData('Phone'),
    hasDriverLicense = true,
    cash = cash,
    bank = 0,
    name = {
      first = char:GetData('First'),
      last = char:GetData('Last')
    },
    aliases = {
      email = ('%s_%s@blue.sky'):format(char:GetData('First'):lower(), char:GetData('Last'):lower()),
      twitter = char:GetData('Twitter')
    }
  })
end)