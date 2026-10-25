const fs = require("fs");
const path = require("path");

const zipPath = "/workspace/hyperframes/hyperframes_project.zip";
const outputPath = "/workspace/hyperframes/hyperframes_video.ipynb";

console.log("Reading zip file from:", zipPath);
const zipBuffer = fs.readFileSync(zipPath);
const zipBase64 = zipBuffer.toString("base64");
console.log(`Zip size: ${zipBuffer.length} bytes, Base64 length: ${zipBase64.length} chars`);

// Chunk base64 into 80-char lines for clean ipynb formatting
const chunkSize = 80;
const chunks = [];
for (let i = 0; i < zipBase64.length; i += chunkSize) {
  chunks.push(zipBase64.slice(i, i + chunkSize));
}
const b64Formatted = chunks.join("\n");

function toLines(text) {
  const lines = text.split("\n");
  return lines.map((l, idx) => (idx === lines.length - 1 ? l : l + "\n"));
}

const notebook = {
  cells: [
    {
      cell_type: "markdown",
      metadata: {},
      source: toLines([
        "# 🎬 Hyperframes Video Generator - Colab Autonomous Renderer",
        "",
        "This Jupyter notebook provides an end-to-end autonomous environment to restore, build, and render your Hyperframes video composition into an MP4 file, then triggers an automatic browser download.",
        "",
        "### 🚀 Instructions:",
        "Simply click **Runtime** > **Run all** (or press `Ctrl+F9` / `Cmd+F9`) to execute the entire pipeline.",
        "",
        "> **⚠️ Important Pop-up Note:**",
        "> Ensure your browser allows pop-ups / automatic downloads from `colab.research.google.com`. If blocked, click the pop-up blocker icon in your browser address bar to allow it.",
        "> You can also download `video.mp4` directly anytime from the left sidebar Files pane (`/content/my-video/video.mp4`)."
      ].join("\n"))
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {
        cellView: "form",
        id: "cell_setup"
      },
      outputs: [],
      source: toLines([
        "# @title ⚙️ Cell 1: System Setup (Node.js 22 & FFmpeg)",
        "# Installs Node.js 22 LTS and FFmpeg required for rendering",
        "",
        "!echo '>>> Setting up Node.js 22 repository...'",
        "!curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - > /dev/null 2>&1",
        "",
        "!echo '>>> Installing Node.js 22 and FFmpeg...'",
        "!sudo apt-get install -y nodejs ffmpeg > /dev/null 2>&1",
        "",
        "!echo '>>> System Verification:'",
        "!node -v",
        "!npm -v",
        "!ffmpeg -version | head -n 1"
      ].join("\n"))
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {
        id: "cell_hyperframes_cli"
      },
      outputs: [],
      source: toLines([
        "# @title 📦 Cell 2: Hyperframes CLI Installation",
        "# Installs Hyperframes CLI globally",
        "",
        "!echo '>>> Installing hyperframes CLI globally...'",
        "!npm install -g hyperframes",
        "",
        "!echo '>>> Hyperframes CLI version:'",
        "!hyperframes --help | head -n 4"
      ].join("\n"))
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {
        id: "cell_restore"
      },
      outputs: [],
      source: toLines([
        "# @title 📂 Cell 3: Restore Embedded Project from Base64",
        "# Decodes the base64 project archive and extracts to /content/my-video",
        "",
        "import base64",
        "import zipfile",
        "import os",
        "",
        "# Base64 encoded hyperframes_project.zip",
        "ZIP_B64 = \"\"\"" + b64Formatted + "\"\"\"",
        "",
        "zip_target = \"/content/hyperframes_project.zip\"",
        "extract_root = \"/content\"",
        "",
        "print(\"1. Decoding base64 archive...\")",
        "raw_zip = base64.b64decode(ZIP_B64)",
        "with open(zip_target, \"wb\") as f:",
        "    f.write(raw_zip)",
        "print(f\"   Saved {zip_target} ({len(raw_zip) / (1024*1024):.2f} MB)\")",
        "",
        "print(\"2. Extracting project files...\")",
        "with zipfile.ZipFile(zip_target, \"r\") as zf:",
        "    zf.extractall(extract_root)",
        "",
        "# Verify project structure",
        "target_dir = \"/content/my-video\"",
        "if not os.path.exists(os.path.join(target_dir, \"index.html\")) and os.path.exists(\"/content/index.html\"):",
        "    os.makedirs(target_dir, exist_ok=True)",
        "    with zipfile.ZipFile(zip_target, \"r\") as zf:",
        "        zf.extractall(target_dir)",
        "",
        "print(\"\\n✅ Project restored successfully in:\", target_dir)",
        "print(\"Project contents:\")",
        "for root, dirs, files in os.walk(target_dir):",
        "    rel = os.path.relpath(root, target_dir)",
        "    depth = 0 if rel == \".\" else rel.count(os.sep) + 1",
        "    indent = \"  \" * depth",
        "    print(f\"{indent}📁 {os.path.basename(root)}/\")",
        "    for f in sorted(files):",
        "        if not f.startswith(\".\"):",
        "            print(f\"{indent}   📄 {f}\")"
      ].join("\n"))
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {
        id: "cell_render"
      },
      outputs: [],
      source: toLines([
        "# @title 🎥 Cell 4: Render Composition to MP4",
        "# Navigates to /content/my-video and renders video.mp4",
        "",
        "%cd /content/my-video",
        "",
        "# ==========================================================================",
        "# 💡 OPTIONAL: Google Drive Backup Note",
        "# If you want to automatically save a copy to your Google Drive in case of",
        "# Colab session timeout or disconnect, uncomment the 3 lines below:",
        "#",
        "# from google.colab import drive",
        "# drive.mount('/content/drive')",
        "# ==========================================================================",
        "",
        "print('>>> Rendering composition to video.mp4 (1080p @ 10s)...')",
        "!npx hyperframes render --output video.mp4",
        "",
        "# Optional copy to Google Drive if mounted:",
        "# import os, shutil",
        "# if os.path.exists('/content/drive/MyDrive') and os.path.exists('/content/my-video/video.mp4'):",
        "#     shutil.copy('/content/my-video/video.mp4', '/content/drive/MyDrive/my_hyperframes_video.mp4')",
        "#     print('Backup saved to Google Drive: MyDrive/my_hyperframes_video.mp4')"
      ].join("\n"))
    },
    {
      cell_type: "code",
      execution_count: null,
      metadata: {
        id: "cell_download"
      },
      outputs: [],
      source: toLines([
        "# @title ⬇️ Cell 5: Automatic Video Download",
        "# Triggers automatic browser download of the rendered video",
        "",
        "import os",
        "import time",
        "from google.colab import files",
        "",
        "# ==========================================================================",
        "# ⚠️ BROWSER POP-UP BLOCKER NOTICE:",
        "# Chrome and other browsers may block automatic file downloads from Colab.",
        "# If your download does not start automatically:",
        "# 1. Look for a 'Pop-up blocked' icon in the right side of the address bar.",
        "# 2. Click it and select 'Always allow pop-ups and redirects from colab.research.google.com'.",
        "# 3. Alternatively, open the Files tab on the left sidebar, navigate to",
        "#    'my-video', right-click 'video.mp4', and click 'Download'.",
        "# ==========================================================================",
        "",
        "output_video_path = '/content/my-video/video.mp4'",
        "",
        "if os.path.exists(output_video_path):",
        "    file_size_mb = os.path.getsize(output_video_path) / (1024 * 1024)",
        "    print(f'🎉 Success! Rendered video found ({file_size_mb:.2f} MB).')",
        "    print('🚀 Initiating automatic browser download...')",
        "    time.sleep(1)",
        "    files.download(output_video_path)",
        "else:",
        "    print(f'❌ Error: {output_video_path} was not found.')",
        "    print('Please check the output of Cell 4 above for any errors during rendering.')"
      ].join("\n"))
    }
  ],
  metadata: {
    accelerator: "GPU",
    colab: {
      provenance: []
    },
    kernelspec: {
      display_name: "Python 3",
      name: "python3"
    },
    language_info: {
      name: "python"
    }
  },
  nbformat: 4,
  nbformat_minor: 0
};

fs.writeFileSync(outputPath, JSON.stringify(notebook, null, 1), "utf-8");
console.log("Notebook successfully written to:", outputPath);
