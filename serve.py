# 本地预览服务器：python serve.py 后访问 http://localhost:3000
# 无缓存模式，避免浏览器缓存导致页面不同步
import http.server
import socketserver
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


PORT = 3000
with socketserver.TCPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Server running on port {PORT}, serving {os.getcwd()}")
    httpd.serve_forever()
