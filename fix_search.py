import re

path = r"f:\dawoanlod\Ecommerce Website\CCS\style.css"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix search button style
old_btn = """.search-box button{
    width: 52px;
    height: 46px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    background: linear-gradient(135deg,#00c6ff,#0072ff);
}
.search-box button:hover{

    background: linear-gradient(135deg,#0072ff,#00c6ff);
}"""

new_btn = """.search-box button{
    width: 58px;
    height: 100%;
    min-height: 52px;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 41, 59, 0.9));
    border-radius: 0 16px 16px 0;
    border-left: 1.5px solid rgba(79, 195, 247, 0.12);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-box button:hover{
    background: linear-gradient(135deg, rgba(0, 198, 255, 0.15), rgba(0, 114, 255, 0.15));
    border-left-color: rgba(79, 195, 247, 0.45);
}
.search-box button svg{
    transition: transform 0.3s ease;
}
.search-box button:hover svg{
    transform: scale(1.15);
}"""

content = content.replace(old_btn, new_btn)

# Fix input text color - add -webkit-text-fill-color
old_input = """.search-box input{
    height: 52px;
    border: none;
    outline: none;
    background: transparent !important;
    color: white;
    padding: 0 18px;"""

new_input = """.search-box input{
    height: 52px;
    border: none;
    outline: none;
    background: transparent !important;
    color: white;
    -webkit-text-fill-color: white;
    padding: 0 18px;"""

content = content.replace(old_input, new_input)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
