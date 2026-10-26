import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(page_title="Secure Password Generator", page_icon="🔐")

base = Path(__file__).parent
html = (base / "index.html").read_text(encoding="utf-8")
css = (base / "style.css").read_text(encoding="utf-8")
js = (base / "script.js").read_text(encoding="utf-8")

html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>{css}</style>")
html = html.replace('<script src="script.js"></script>', f"<script>{js}</script>")

components.html(html, height=700, scrolling=True)
