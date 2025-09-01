# Sign-Dimensions-of-Objects-JS-Script-for-Illustrator
In Illustrator, you often need to quickly annotate object dimensions for layouts, presentations, or technical drawings. This script allows you to select multiple objects on "Layer 1" and automatically place width labels above and height labels to the left of each object. Labels are centered relative to the object's dimensions. The font size, offset, and measurement units can be customized.

How to work with the script:

1. Place the script file in Adobe\Adobe Illustrator 2023\Presets\en_GB\Scripts
2. Open your Illustrator file and select the objects you want to label on the layer named "Layer 1".
3. Click File -> Scripts -> Color of Rectangle
4. A dialog window will appear where you can:
  Set the font size (pt)
  Set the offset from the object (pt)
  Choose units: pt, mm, or inches

You can improve:
1. Currently, the script labels only objects on "Layer 1". You could add an option to select any layer
2. The offset applies in points; it might be useful to make it respect the chosen measurement unit
3. Currently, vertical labels are always rotated 90°; you could add an option to change rotation dynamically.
