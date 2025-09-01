(function () {
    // Exit if no document is open
    if (app.documents.length === 0) {
        alert("No open documents.");
        return;
    }

    var doc = app.activeDocument;
    var sel = doc.selection;

    // Exit if nothing is selected
    if (sel.length === 0) {
        alert("Nothing is selected.");
        return;
    }

    // === Dialog Window for Settings ===
    var dlg = new Window("dialog", "Label Parameters");
    dlg.alignChildren = "left";

    // Font size input
    dlg.add("statictext", undefined, "Font size (pt):");
    var fontSizeInput = dlg.add("edittext", undefined, "32");
    fontSizeInput.characters = 5;

    // Offset input
    dlg.add("statictext", undefined, "Offset from object (pt):");
    var offsetInput = dlg.add("edittext", undefined, "40");
    offsetInput.characters = 5;

    // Units selection
    dlg.add("statictext", undefined, "Measurement units:");
    var unitsGroup = dlg.add("group");
    unitsGroup.orientation = "row";
    var unitPt = unitsGroup.add("radiobutton", undefined, "pt");
    var unitIn = unitsGroup.add("radiobutton", undefined, "inches");
    var unitMm = unitsGroup.add("radiobutton", undefined, "mm");
    unitMm.value = true; // default: millimeters

    // OK/Cancel buttons
    var btnGroup = dlg.add("group");
    btnGroup.alignment = "right";
    var okBtn = btnGroup.add("button", undefined, "OK");
    var cancelBtn = btnGroup.add("button", undefined, "Cancel");

    // Exit if dialog canceled
    if (dlg.show() !== 1) return;

    // Read values from dialog
    var fontSize = parseFloat(fontSizeInput.text) || 32;
    var offset = parseFloat(offsetInput.text) || 0;

    var unit = "mm";
    if (unitPt.value) unit = "pt";
    if (unitIn.value) unit = "inches";
    if (unitMm.value) unit = "mm";

    // === Main Logic ===
    var processedCount = 0;

    for (var i = 0; i < sel.length; i++) {
        var item = sel[i];

        // Process only objects on "Layer 1"
        if (item.layer.name !== "Layer 1") continue;

        // Get geometric bounds of the object
        var bounds = item.geometricBounds; // [x1, y1, x2, y2]
        var x1 = bounds[0];
        var y1 = bounds[1];
        var x2 = bounds[2];
        var y2 = bounds[3];

        var widthPt = x2 - x1;     // width in points
        var heightPt = y1 - y2;    // height in points

        // Convert dimensions based on selected units
        var widthVal, heightVal, suffix;
        switch (unit) {
            case "pt":
                widthVal = Math.round(widthPt);
                heightVal = Math.round(heightPt);
                suffix = " pt";
                break;
            case "inches":
                widthVal = (widthPt / 72).toFixed(2);   // 1 inch = 72 pt
                heightVal = (heightPt / 72).toFixed(2);
                suffix = " in";
                break;
            case "mm":
            default:
                widthVal = Math.round(widthPt * 25.4 / 72); // 1 pt = 25.4/72 mm
                heightVal = Math.round(heightPt * 25.4 / 72);
                suffix = " mm";
                break;
        }

        // Object center points
        var centerX = x1 + widthPt / 2;
        var centerY = y1 - heightPt / 2;

        // Place dimension labels
        placeWidthLabel(widthVal, suffix, centerX, y1, offset, widthPt);
        placeHeightLabel(heightVal, suffix, x1, centerY, offset, heightPt);

        processedCount++;
    }

    // Show report to user
    if (processedCount === 0) {
        alert("No objects on 'Layer 1' were processed.");
    } else {
        alert("Labels added for " + processedCount + " object(s).");
    }

    // === Helper Functions ===

    // Places width label above the object.
    function placeWidthLabel(value, suffix, centerX, yTop, offset, objectWidthPt) {
        var text = value.toString() + suffix;

        // Create a temporary frame to measure text width
        var tfTest = doc.textFrames.add();
        tfTest.contents = text;
        tfTest.textRange.size = fontSize;
        var vbTest = tfTest.visibleBounds;
        var textWidth = vbTest[2] - vbTest[0];
        tfTest.remove();

        // If label is wider than object, remove suffix
        if (textWidth > objectWidthPt) {
            text = value.toString();
        }

        // Create final text frame
        var tf = doc.textFrames.add();
        tf.contents = text;
        tf.textRange.size = fontSize;
        tf.textRange.fillColor = makeRed();

        // Position label centered above the object
        tf.position = [centerX, yTop];
        var vb = tf.visibleBounds;
        var w = vb[2] - vb[0];
        var h = vb[1] - vb[3];

        var desiredBottom = yTop + offset;
        var left = centerX - w / 2;
        var top = desiredBottom + h;

        tf.position = [left, top];
    }

    // Places height label to the left of the object.
    function placeHeightLabel(value, suffix, xLeft, centerY, offset, objectHeightPt) {
        var text = value.toString() + suffix;

        // Create a temporary frame to measure text height (rotated)
        var tfTest = doc.textFrames.add();
        tfTest.contents = text;
        tfTest.textRange.size = fontSize;
        tfTest.rotate(90);
        var vbTest = tfTest.visibleBounds;
        var textHeight = vbTest[2] - vbTest[0]; // rotated width = vertical height
        tfTest.remove();

        // If label is taller than object, remove suffix
        if (textHeight > objectHeightPt) {
            text = value.toString();
        }

        // Create final text frame
        var tf = doc.textFrames.add();
        tf.contents = text;
        tf.textRange.size = fontSize;
        tf.textRange.fillColor = makeRed();
        tf.rotate(90);

        // Position label centered on the left of the object
        tf.position = [xLeft, centerY];
        var vb = tf.visibleBounds;
        var w = vb[2] - vb[0];
        var h = vb[1] - vb[3];

        var desiredRight = xLeft - offset;
        var left = desiredRight - w;
        var top = centerY + h / 2;

        tf.position = [left, top];
    }

    // Returns a red RGBColor.
    function makeRed() {
        var red = new RGBColor();
        red.red = 255;
        red.green = 0;
        red.blue = 0;
        return red;
    }
})();
