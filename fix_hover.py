path = r"f:\dawoanlod\Ecommerce Website\CCS\style.css"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if ".search-box button:hover" in line:
        # Found the hover rule, now find and replace the background line
        for j in range(i+1, min(i+5, len(lines))):
            if "background: linear-gradient(135deg,#0072ff,#00c6ff)" in lines[j]:
                lines[j] = lines[j].replace("background: linear-gradient(135deg,#0072ff,#00c6ff)", "background: transparent")
                print(f"Replaced line {j+1}")
                break
        break

with open(path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Done!")
