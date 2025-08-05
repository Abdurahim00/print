"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Trash2,
  Copy,
  RotateCcw,
} from "lucide-react"
import { useFabricCanvas } from "@/hooks/useFabricCanvas"
import { RootState } from "@/lib/redux/store"

export function TextPanel() {
  const { selectedObject, fabricCanvas } = useSelector((state: RootState) => state.canvas)
  const { selectedTool } = useSelector((state: RootState) => state.design)
  const { updateTextProperties, deleteSelected, duplicateSelected } = useFabricCanvas("design-canvas")

  const [textProperties, setTextProperties] = useState({
    text: "",
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#000000", // Default text color set to black for visibility
    fontWeight: "normal",
    fontStyle: "normal",
    underline: false,
    textAlign: "left",
  })

  // Update local state when selected object changes
  useEffect(() => {
    if (selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text")) {
      setTextProperties({
        text: selectedObject.text || "",
        fontSize: selectedObject.fontSize || 24,
        fontFamily: selectedObject.fontFamily || "Arial",
        fill: selectedObject.fill || "#000000", // Ensure this matches the new default
        fontWeight: selectedObject.fontWeight || "normal",
        fontStyle: selectedObject.fontStyle || "normal",
        underline: selectedObject.underline || false,
        textAlign: selectedObject.textAlign || "left",
      })
    }
  }, [selectedObject])

  const handleTextChange = (value: string) => {
    if (fabricCanvas && selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text")) {
      const activeObject = fabricCanvas.getActiveObject()
      if (activeObject) {
        activeObject.set("text", value)
        fabricCanvas.requestRenderAll()
        setTextProperties((prev) => ({ ...prev, text: value }))
      }
    }
  }

  const handlePropertyChange = (property: string, value: any) => {
    if (fabricCanvas && selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text")) {
      updateTextProperties(fabricCanvas, { [property]: value })
      setTextProperties((prev) => ({ ...prev, [property]: value }))
    }
  }

  const handleFontSizeChange = (value: number[]) => {
    handlePropertyChange("fontSize", value[0])
  }

  const handleColorChange = (color: string) => {
    handlePropertyChange("fill", color)
  }

  const handleFontFamilyChange = (fontFamily: string) => {
    handlePropertyChange("fontFamily", fontFamily)
  }

  const handleStyleToggle = (style: string) => {
    let newValue
    if (style === "fontWeight") {
      newValue = textProperties.fontWeight === "bold" ? "normal" : "bold"
    } else if (style === "fontStyle") {
      newValue = textProperties.fontStyle === "italic" ? "normal" : "italic"
    } else if (style === "underline") {
      newValue = !textProperties.underline
    }
    handlePropertyChange(style, newValue)
  }

  const handleAlignChange = (align: string) => {
    handlePropertyChange("textAlign", align)
  }

  const resetText = () => {
    handlePropertyChange("fontSize", 24)
    handlePropertyChange("fontFamily", "Arial")
    handlePropertyChange("fill", "#000000") // Ensure this matches the new default
    handlePropertyChange("fontWeight", "normal")
    handlePropertyChange("fontStyle", "normal")
    handlePropertyChange("underline", false)
    handlePropertyChange("textAlign", "left")
  }

  const enterEditMode = () => {
    if (fabricCanvas && selectedObject && selectedObject.type === "i-text") {
      const activeObject = fabricCanvas.getActiveObject()
      if (activeObject && activeObject.enterEditing) {
        activeObject.enterEditing()
        activeObject.selectAll()
      }
    }
  }

  // Show text controls when text tool is selected or text object is selected
  const showTextControls =
    selectedTool === "text" || (selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text"))

  if (!showTextControls) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
        <Type className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-center text-sm">Select the Text tool (T) to add and edit text</p>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-h-full overflow-y-auto">
      {/* Instructions when text tool is selected but no text is selected */}
      {selectedTool === "text" &&
        (!selectedObject || (selectedObject.type !== "text" && selectedObject.type !== "i-text")) && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-2 text-blue-800">
              <Type className="w-5 h-5" />
              <span className="font-medium">Text Tool Active</span>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Click the Text tool (T) again to add more text to the canvas. Each click adds a new text element.
            </p>
          </div>
        )}

      {/* Text Input and Controls - Only show when text is selected */}
      {selectedObject && (selectedObject.type === "text" || selectedObject.type === "i-text") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="text-input" className="text-sm font-medium">
              Text Content
            </Label>
            <Input
              id="text-input"
              value={textProperties.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your text"
              className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={enterEditMode}
                className="text-xs bg-transparent hover:bg-gray-50"
              >
                Edit on Canvas
              </Button>
            </div>
          </div>

          {/* Text Formatting */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formatting</Label>
            <div className="flex space-x-2">
              <Button
                variant={textProperties.fontWeight === "bold" ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleStyleToggle("fontWeight")}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.fontStyle === "italic" ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleStyleToggle("fontStyle")}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.underline ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleStyleToggle("underline")}
              >
                <Underline className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                variant={textProperties.textAlign === "left" ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleAlignChange("left")}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === "center" ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleAlignChange("center")}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={textProperties.textAlign === "right" ? "default" : "outline"}
                size="sm"
                className="rounded-xl transition-all duration-200 hover:scale-105"
                onClick={() => handleAlignChange("right")}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Font Family */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Font Family</Label>
            <Select value={textProperties.fontFamily} onValueChange={handleFontFamilyChange}>
              <SelectTrigger className="rounded-xl border-gray-300 focus:border-blue-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
                <SelectItem value="Impact">Impact</SelectItem>
                <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Font Size</Label>
              <span className="text-sm text-gray-600 font-mono">{textProperties.fontSize}px</span>
            </div>
            <Slider
              value={[textProperties.fontSize]}
              onValueChange={handleFontSizeChange}
              max={120}
              min={8}
              step={1}
              className="w-full"
            />
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Text Color</Label>
            <div className="grid grid-cols-6 gap-2">
              {[
                "#000000",
                "#ffffff",
                "#ff0000",
                "#00ff00",
                "#0000ff",
                "#ffff00",
                "#ff00ff",
                "#00ffff",
                "#ffa500",
                "#800080",
                "#008000",
                "#ffc0cb",
                "#8b4513",
                "#ff69b4",
                "#40e0d0",
                "#ee82ee",
                "#90ee90",
                "#ffd700",
                "#dc143c",
                "#4169e1",
                "#32cd32",
                "#ff1493",
                "#00ced1",
                "#ff6347",
                "#9370db",
                "#3cb371",
                "#ff4500",
                "#da70d6",
                "#00fa9a",
                "#ff8c00",
              ].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    textProperties.fill === color
                      ? "border-blue-500 ring-2 ring-blue-200 scale-110"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="rounded-xl transition-all duration-200 hover:scale-105 bg-transparent"
                onClick={() => duplicateSelected(fabricCanvas)} // Pass fabricCanvas
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                className="rounded-xl transition-all duration-200 hover:scale-105 bg-transparent"
                onClick={resetText}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full rounded-xl transition-all duration-200 hover:scale-105"
              onClick={() => deleteSelected(fabricCanvas)} // Pass fabricCanvas
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Text
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
