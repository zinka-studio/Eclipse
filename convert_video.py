#!/usr/bin/env python3
"""Convert video to WebP frame sequence at 30fps"""

from moviepy.editor import VideoFileClip
import os
from pathlib import Path

# Paths
input_file = r"d:\APP DEV AI\02 Eclipse\media\Comp 1_3.mp4"
output_dir = r"d:\APP DEV AI\02 Eclipse\media"
fps = 30

print(f"Loading video: {input_file}")
video = VideoFileClip(input_file)

print(f"Video duration: {video.duration:.2f}s")
print(f"Original fps: {video.fps}")
print(f"Video size: {video.size}")
print(f"\nConverting to WebP sequence at {fps}fps...")
print(f"Output directory: {output_dir}\n")

# Calculate total frames
total_frames = int(video.duration * fps)
print(f"Total frames to generate: {total_frames}\n")

frame_count = 0
for i, frame in enumerate(video.iter_frames(fps=fps)):
    frame_count += 1
    frame_num = f"{frame_count:04d}"
    output_path = os.path.join(output_dir, f"frame-{frame_num}.webp")

    # Import PIL here to save frames
    from PIL import Image
    img = Image.fromarray(frame)
    img.save(output_path, "WEBP", quality=95)

    # Progress indicator
    if frame_count % max(1, total_frames // 20) == 0:
        percent = (frame_count / total_frames) * 100
        print(f"Progress: {percent:3.0f}% ({frame_count}/{total_frames} frames)")

video.close()

print(f"\n✓ Conversion complete!")
print(f"Generated {frame_count} WebP frames in {output_dir}")

# List first and last frames
frames = sorted([f for f in os.listdir(output_dir) if f.startswith("frame-") and f.endswith(".webp")])
if frames:
    print(f"\nFirst frame: {frames[0]}")
    print(f"Last frame: {frames[-1]}")
    print(f"Total frames created: {len(frames)}")
