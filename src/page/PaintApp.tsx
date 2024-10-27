import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { HiPaintBrush } from "react-icons/hi2";
import { FaEraser } from "react-icons/fa6";
import { RectangleHorizontal } from "lucide-react";
import { colors } from "@/lib/colors";

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
 // const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState("brush");
  const [lineWidth, setLineWidth] = useState(5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (context) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      context.lineTo(x, y);
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
      // context.lineWidth = tool === "eraser" ? 20 : lineWidth;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setPosition({
      x: e.clientX - (containerRef.current?.offsetLeft || 0),
      y: e.clientY - (containerRef.current?.offsetTop || 0),
    });
  };

  const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      const left = e.clientX - position.x;
      const top = e.clientY - position.y;
      if (containerRef.current) {
        containerRef.current.style.left = `${left}px`;
        containerRef.current.style.top = `${top}px`;
      }
    }
  };

  const stopDragging = () => {
    setDragging(false);
  };

  return (
    <div className="h-screen bg-teal-600 overflow-hidden">
      <div
        ref={containerRef}
        className="absolute bg-gray-200 shadow-md"
        style={{
          width: "800px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="bg-blue-900 text-white px-2 py-1 flex justify-between items-center cursor-move"
          onMouseDown={startDragging}
          onMouseMove={onDrag}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
        >
          <span>untitled - Paint</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              className="h-5 w-5 p-0 min-w-0 text-white hover:bg-blue-700"
            >
              _
            </Button>
            <Button
              variant="ghost"
              className="h-5 w-5 p-0 min-w-0 text-white hover:bg-blue-700"
            >
              □
            </Button>
            <Button
              variant="ghost"
              className="h-5 w-5 p-0 min-w-0 text-white hover:bg-blue-700"
            >
              ×
            </Button>
          </div>
        </div>
        <div className="bg-gray-300 px-2 py-1 text-sm">
          <span className="mr-4"><span className="underline underline-offset-2">F</span>ile</span>
          <span className="mr-4"><span className="underline underline-offset-2">E</span>dit</span>
          <span className="mr-4"><span className="underline underline-offset-2">V</span>iew</span>
          <span className="mr-4"><span className="underline underline-offset-2">I</span>mage</span>
          <span className="mr-4"><span className="underline underline-offset-2">O</span>ptions</span>
          <span><span className="underline underline-offset-2">H</span>elp</span>
        </div>
        <div className="flex">
          <div className="w-8 bg-gray-300 p-0.5 border-r border-gray-400">
            <Button
              variant="ghost"
              className={`w-7 h-7 p-0 min-w-0 mb-0.5 ${
                tool === "brush"
                  ? "bg-gray-300 border border-gray-400 shadow-inner"
                  : ""
              }`}
              onClick={() => setTool("brush")}
            >
              <HiPaintBrush className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className={`w-7 h-7 p-0 min-w-0 mb-0.5 ${
                tool === "eraser"
                  ? "bg-gray-300 border border-gray-400 shadow-inner"
                  : ""
              }`}
              onClick={() => setTool("eraser")}
            >
              <FaEraser className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              className={`w-7 h-7 p-0 min-w-0 mb-0.5 ${
                tool === "reactangle"
                  ? "bg-gray-300 border border-gray-400 shadow-inner"
                  : ""
              }`}
              onClick={() => setTool("reactangle")}
            >
              <RectangleHorizontal className="w-5 h-5" />
            </Button>
          </div>
          <div
            className="flex-grow overflow-auto border border-gray-400"
            style={{ width: "724px", height: "500px" }}
          >
            <canvas
              ref={canvasRef}
              width={2000}
              height={2000}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
            />
          </div>
        </div>
        <div className="flex bg-gray-300 p-1 border-t border-gray-400">
          <div className="flex w-full">
            <p className="w-2/12">Width:</p>{" "}
            <Slider
              defaultValue={[5]}
              max={100}
              step={1}
              onValueChange={(e) => setLineWidth(e[0])}
            />
          </div>
        </div>
        <div className="flex bg-gray-300 p-1 border-t border-gray-400">
          <div className="flex flex-wrap gap-1">
            {colors.map((c) => (
              <Button
                key={c}
                variant="ghost"
                className={`w-6 h-6 p-0 min-w-0 ${
                  color === c ? "ring-1 ring-gray-600" : ""
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="bg-gray-300 px-2 py-1 text-sm border-t border-gray-400">
          For Help, click Help Topics on the Help Menu.
        </div>
      </div>
    </div>
  );
}
