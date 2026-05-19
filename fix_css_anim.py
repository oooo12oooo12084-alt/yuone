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
    print("Fixed successfully!")
else:
    print("Exact match not found. Trying flexible approach...")
    lines = content.split("\n")
    # Find all search-box button related lines and rebuild
    start_idx = None
    end_idx = None
    for i, line in enumerate(lines):
        if ".search-box button{" in line and "hover" not in line and "svg" not in line and "active" not in line:
            if start_idx is None:
                start_idx = i
        if start_idx is not None and ".search-box button:active svg" in line:
            # Find the closing brace after this
            for j in range(i, len(lines)):
                if "}" in lines[j]:
                    end_idx = j
                    break
            break

    if start_idx is not None and end_idx is not None:
        new_lines = lines[:start_idx]
        new_lines.append(""".search-box button{
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
}""")
        new_lines.extend(lines[end_idx+1:])
        content = "\n".join(new_lines)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Fixed with flexible approach!")
    else:
        print(f"Could not find section. start_idx={start_idx}, end_idx={end_idx}")
