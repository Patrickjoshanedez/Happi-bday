RECORDING SETUP INSTRUCTIONS
=============================

To add your voice recording to the message slide:

1. Record your voice message (your reading of the birthday message)
2. Save it as an MP3 file
3. Place it in this folder and name it "recording.mp3"
4. Refresh the page

RECOMMENDED:
- File size: Under 3MB for faster loading
- Format: MP3, WAV, or M4A
- Duration: Should match the length of the typed message (about 30-45 seconds)
- Content: Read the birthday message aloud in your own voice

ALTERNATIVE:
If you want to use a different filename, update the path in:
src/components/Slide.tsx (line 229)

TROUBLESHOOTING:
- Make sure the file is actually in the public/audio/ folder
- Check that the filename matches exactly (case-sensitive)
- Try a different audio format if it doesn't play
- Ensure the recording is clear and not too quiet

TIMING:
The recording will start playing automatically when the text begins typing on the message slide.
