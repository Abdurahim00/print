"use client"

import { useState, useRef, useEffect } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { translations, fonts, colors } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/ui/file-upload"
import { useToast } from "@/hooks/use-toast"
import { Type, ImageIcon, Download, Save, Move, Square, Circle, Palette, FileText } from "lucide-react"

interface DesignElement {
  id: string
  type: "text" | "image" | "shape"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  borderRadius?: number
}

export default function DesignToolPage() {
  const { language, user } = useAppSelector((state) => ({
    language: state.app.language,
    user: state.auth.user,
  }))
  const t = translations[language]
  const { toast } = useToast()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [designName, setDesignName] = useState("Untitled Design")

  // Text properties
  const [textContent, setTextContent] = useState("")
  const [selectedFont, setSelectedFont] = useState(fonts[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [fontSize, setFontSize] = useState(24)

  // Image upload
  const [uploadedImage, setUploadedImage] = useState("")

  useEffect(() => {
    drawCanvas()
  }, [elements, selectedElement])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#f0f0f0"
    ctx.lineWidth = 1
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.save()
      ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
      ctx.rotate((element.rotation * Math.PI) / 180)
      ctx.translate(-element.width / 2, -element.height / 2)

      if (element.type === "text") {
        ctx.fillStyle = element.color || "#000000"
        ctx.font = `${element.fontSize || 24}px ${element.fontFamily || "Arial"}`
        ctx.textAlign = "left"
        ctx.textBaseline = "top"
        ctx.fillText(element.content, 0, 0)
      } else if (element.type === "image" && element.content) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.drawImage(img, 0, 0, element.width, element.height)
        }
        img.src = element.content
      } else if (element.type === "shape") {
        ctx.fillStyle = element.backgroundColor || "#cccccc"
        if (element.borderRadius && element.borderRadius > 0) {
          // Draw rounded rectangle (circle if borderRadius is high)
          const radius = Math.min(element.borderRadius, element.width / 2, element.height / 2)
          ctx.beginPath()
          ctx.roundRect(0, 0, element.width, element.height, radius)
          ctx.fill()
        } else {
          ctx.fillRect(0, 0, element.width, element.height)
        }
      }

      // Draw selection border
      if (selectedElement === element.id) {
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(-2, -2, element.width + 4, element.height + 4)
        ctx.setLineDash([])
      }

      ctx.restore()
    })
  }

  const addTextElement = () => {
    if (!textContent.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text first.",
        variant: "destructive",
      })
      return
    }

    const newElement: DesignElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: textContent,
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      rotation: 0,
      fontSize,
      fontFamily: selectedFont,
      color: selectedColor,
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
    setTextContent("")

    toast({
      title: "Text Added",
      description: "Text element has been added to your design.",
      variant: "success",
    })
  }

  const addImageElement = () => {
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Please upload an image first.",
        variant: "destructive",
      })
      return
    }

    const newElement: DesignElement = {
      id: `image-${Date.now()}`,
      type: "image",
      content: uploadedImage,
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)

    toast({
      title: "Image Added",
      description: "Image has been added to your design.",
      variant: "success",
    })
  }

  const addShapeElement = (shapeType: "rectangle" | "circle") => {
    const newElement: DesignElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: shapeType,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      rotation: 0,
      backgroundColor: "#cccccc",
      borderRadius: shapeType === "circle" ? 50 : 0,
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)

    toast({
      title: "Shape Added",
      description: `${shapeType} has been added to your design.`,
      variant: "success",
    })
  }

  const updateSelectedElement = (updates: Partial<DesignElement>) => {
    if (!selectedElement) return

    setElements(elements.map((el) => (el.id === selectedElement ? { ...el, ...updates } : el)))
  }

  const deleteSelectedElement = () => {
    if (!selectedElement) return

    setElements(elements.filter((el) => el.id !== selectedElement))
    setSelectedElement(null)

    toast({
      title: "Element Deleted",
      description: "Selected element has been removed from your design.",
      variant: "success",
    })
  }

  const saveDesign = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to save your design.",
        variant: "destructive",
      })
      return
    }

    try {
      const canvas = canvasRef.current
      if (!canvas) return

      const preview = canvas.toDataURL("image/png")

      const designData = {
        name: designName,
        type: "Custom Design",
        preview,
        userId: user.id,
        designData: {
          elements,
          canvasSize,
        },
      }

      const response = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      })

      if (response.ok) {
        toast({
          title: "Design Saved",
          description: `"${designName}" has been saved to your designs.`,
          variant: "success",
        })
      } else {
        throw new Error("Failed to save design")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save design. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportDesign = (format: "png" | "pdf") => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (format === "png") {
      const link = document.createElement("a")
      link.download = `${designName}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } else if (format === "pdf") {
      // For PDF export, we'd typically use a library like jsPDF
      toast({
        title: "PDF Export",
        description: "PDF export functionality would be implemented here.",
        variant: "success",
      })
    }
  }

  const selectedElementData = elements.find((el) => el.id === selectedElement)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{t.designTool}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          Create stunning designs with our professional design tools.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tools Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Design Name</Label>
                <Input
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="Enter design name"
                />
              </div>

              <Separator />

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text">
                    <Type className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="shapes">
                    <Square className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Text Content</Label>
                    <Input
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Enter your text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Font</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      min="8"
                      max="72"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded border-2 ${
                            selectedColor === color ? "border-slate-900" : "border-slate-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <Button onClick={addTextElement} className="w-full">
                    <Type className="mr-2 h-4 w-4" />
                    Add Text
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <FileUpload label="Upload Image" value={uploadedImage} onChange={setUploadedImage} accept="image/*" />

                  <Button onClick={addImageElement} className="w-full" disabled={!uploadedImage}>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                </TabsContent>

                <TabsContent value="shapes" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => addShapeElement("rectangle")} className="aspect-square">
                      <Square className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" onClick={() => addShapeElement("circle")} className="aspect-square">
                      <Circle className="h-6 w-6" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Element Properties */}
          {selectedElementData && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Move className="h-5 w-5" />
                  Element Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>X Position</Label>
                    <Input
                      type="number"
                      value={selectedElementData.x}
                      onChange={(e) => updateSelectedElement({ x: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Y Position</Label>
                    <Input
                      type="number"
                      value={selectedElementData.y}
                      onChange={(e) => updateSelectedElement({ y: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label>Width</Label>
                    <Input
                      type="number"
                      value={selectedElementData.width}
                      onChange={(e) => updateSelectedElement({ width: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Height</Label>
                    <Input
                      type="number"
                      value={selectedElementData.height}
                      onChange={(e) => updateSelectedElement({ height: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Rotation (degrees)</Label>
                  <Input
                    type="number"
                    value={selectedElementData.rotation}
                    onChange={(e) => updateSelectedElement({ rotation: Number(e.target.value) })}
                    min="0"
                    max="360"
                  />
                </div>

                {selectedElementData.type === "text" && (
                  <>
                    <div className="space-y-1">
                      <Label>Font Size</Label>
                      <Input
                        type="number"
                        value={selectedElementData.fontSize || 24}
                        onChange={(e) => updateSelectedElement({ fontSize: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Color</Label>
                      <div className="flex flex-wrap gap-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded border ${
                              selectedElementData.color === color ? "border-slate-900" : "border-slate-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateSelectedElement({ color })}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedElementData.type === "shape" && (
                  <div className="space-y-1">
                    <Label>Background Color</Label>
                    <div className="flex flex-wrap gap-1">
                      {colors.map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded border ${
                            selectedElementData.backgroundColor === color ? "border-slate-900" : "border-slate-300"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => updateSelectedElement({ backgroundColor: color })}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Button variant="destructive" onClick={deleteSelectedElement} className="w-full">
                  Delete Element
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Design Canvas</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveDesign}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Design
                </Button>
                <Button variant="outline" onClick={() => exportDesign("png")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PNG
                </Button>
                <Button variant="outline" onClick={() => exportDesign("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  className="border border-slate-300 bg-white cursor-crosshair mx-auto block"
                  onClick={(e) => {
                    const rect = canvasRef.current?.getBoundingClientRect()
                    if (!rect) return

                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top

                    // Find clicked element
                    const clickedElement = elements.find(
                      (el) => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height,
                    )

                    setSelectedElement(clickedElement?.id || null)
                  }}
                />
              </div>

              <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Click on elements to select them. Use the properties panel to modify selected elements.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
