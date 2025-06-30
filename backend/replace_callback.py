# Скрипт для замены callback
import re

with open("main.py", "r") as f:
    content = f.read()

with open("/tmp/new_callback.py", "r") as f:
    new_callback = f.read()

# Ищем старый callback
start_marker = "@app.get(\"/auth/callback\")"
end_marker = "return RedirectResponse(url=error_url)"

# Находим позиции
start_pos = content.find(start_marker)
if start_pos == -1:
    print("Start marker not found")
    exit(1)

# Ищем конец callback после start_pos
temp_content = content[start_pos:]
end_pos_relative = temp_content.find(end_marker)
if end_pos_relative == -1:
    print("End marker not found")
    exit(1)

# Находим конец строки с end_marker
end_pos = start_pos + end_pos_relative
end_line_pos = content.find("\n", end_pos)
if end_line_pos == -1:
    end_line_pos = len(content)

# Заменяем
new_content = content[:start_pos] + new_callback + content[end_line_pos:]

with open("main.py", "w") as f:
    f.write(new_content)

print("Callback replaced successfully")
