path = r"f:\dawoanlod\Ecommerce Website\CCS\style.css"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = """.search-box button{
    width: 52px;
    height: 46px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    background: transparent;
}
.search-box button:hover{

    background: transparent;
}"""

new = """.search-box button{
    width: 52px;
    height: 46px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    background: transparent;
    transition: all 0.3s ease;
}
.search-box button svg{
    transition: transform 0.3s ease, filter 0.3s ease;
}
.search-box button:hover{
    background: transparent;
    transform: scale(1.1);
}
.search-box button:hover svg{
    transform: rotate(15deg) scale(1.15);
    filter: drop-shadow(0 0 6px rgba(0, 114, 255, 0.5));
}
.search-box button:active svg{
    transform: rotate(-5deg) scale(0.95);
}"""

if old in content:
    content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Old content not found, trying line-by-line...")
    lines = content.split("\n")
    for i, line in enumerate(lines):
        if ".search-box button{" in line and "hover" not in line:
            # Found the button rule start
            # Add transition after background line
            for j in range(i, min(i+10, len(lines))):
                if "background: transparent" in lines[j] and "hover" not in lines[j]:
                    lines[j] = lines[j].rstrip() + "\n    transition: all 0.3s ease;"
                    print(f"Added transition at line {j+1}")
                    break
            break

    # Now handle hover section
    for i, line in enumerate(lines):
        if ".search-box button:hover{" in line:
            for j in range(i, min(i+5, len(lines))):
                if "background: transparent" in lines[j]:
                    lines[j] = lines[j].rstrip() + "\n    transform: scale(1.1);"
                    print(f"Added transform at line {j+1}")
                    break
            break

    content = "\n".join(lines)

    # Add new rules after the hover block
    insert_text = """\n.search-box button svg{
    transition: transform 0.3s ease, filter 0.3s ease;
}
.search-box button:hover svg{
    transform: rotate(15deg) scale(1.15);
    filter: drop-shadow(0 0 6px rgba(0, 114, 255, 0.5));
}
.search-box button:active svg{
    transform: rotate(-5deg) scale(0.95);
}"""

    # Find the end of hover block
    hover_idx = content.find(".search-box button:hover{")
    if hover_idx != -1:
        # Find the closing brace after hover
        brace_count = 0
        pos = hover_idx
        while pos < len(content):
            if content[pos] == "{":
                brace_count += 1
            elif content[pos] == "}":
                brace_count -= 1
                if brace_count == 0:
                    content = content[:pos+1] + insert_text + content[pos+1:]
                    break
            pos += 1

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Done with line approach!")
