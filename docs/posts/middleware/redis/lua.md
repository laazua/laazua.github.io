#### Lua脚本

- **lua脚本执行示例**
```lua
-- redis-cli执行lua脚本: test.lua
local function test()
    return redis.call("INFO")
end

return test()

-- 执行(不建议): 
--    redis-cli -h IP -p PORT --eval test.lua

-- 又或者(建议):
--    生成脚本 SHA 值
--        SHA1=$(redis-cli SCRIPT LOAD "`cat test.lua`")
--        SHA1=$(redis-cli SCRIPT LOAD "$(cat test.lua)")
--        SHA1=$(cat test.lua | redis-cli -x SCRIPT LOAD)
--    使用 SHA 值执行(最后的 0 代表脚本需要的key数量):
--        redis-cli -h 127.0.0.1 -p 6379 EVALSHA "$SHA1" 0
```

- **lua脚本带参执行示例**
```lua
-- test_arg.lua
-- 处理不同类型的参数
local results = {}

-- KEYS参数
results.keys = KEYS
results.key_count = #KEYS

-- ARGV参数（注意：所有参数都是字符串类型）
for i, arg in ipairs(ARGV) do
    results['argv' .. i] = {
        original = arg,
        type = type(arg),
        as_number = tonumber(arg),
        as_boolean = (arg == 'true' or arg == '1'),
        length = #arg
    }
end

-- 特殊处理数值参数
if #ARGV >= 2 then
    local num1 = tonumber(ARGV[1])
    local num2 = tonumber(ARGV[2])
    if num1 and num2 then
        results.calculations = {
            sum = num1 + num2,
            difference = num1 - num2,
            product = num1 * num2,
            quotient = num2 ~= 0 and (num1 / num2) or nil
        }
    end
end

return results

-- SHA=$(cat test_arg.lua |redis-cli -x SCRIPT LOAD)
-- redis-cli EVALSHA "$SHA" 2 key1 key2 , 100 25
-- redis-cli EVALSHA "$SHA" 1 user:1 , true false 1 0
-- redis-cli EVALSHA "$SHA" 0 , "test" "123" "true" "3.14"

```