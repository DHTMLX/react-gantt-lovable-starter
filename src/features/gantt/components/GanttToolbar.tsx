import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";
import { ZOOM_LEVELS, ZOOM_ORDER, type ZoomLevel } from "@/features/gantt/utils/zoom";

interface GanttToolbarProps {
  zoom: ZoomLevel;
  onZoomChange: (level: ZoomLevel) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  readOnly?: boolean;
}

export function GanttToolbar({
  zoom,
  onZoomChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  readOnly = false,
}: GanttToolbarProps) {
  const zoomIdx = useMemo(() => ZOOM_ORDER.indexOf(zoom), [zoom]);

  const zoomIn = () => {
    if (zoomIdx > 0) onZoomChange(ZOOM_ORDER[zoomIdx - 1]);
  };
  const zoomOut = () => {
    if (zoomIdx < ZOOM_ORDER.length - 1) onZoomChange(ZOOM_ORDER[zoomIdx + 1]);
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-t-lg border bg-card shrink-0">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-primary">Timeline Controls</p>
        <p className="text-xs text-muted-foreground">Adjust zoom and navigate changes without leaving the schedule.</p>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Zoom controls */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={zoomIdx <= 0}
          onClick={zoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Select value={zoom} onValueChange={(v) => onZoomChange(v as ZoomLevel)}>
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ZOOM_ORDER.map((level) => (
              <SelectItem key={level} value={level}>
                {ZOOM_LEVELS[level].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={zoomIdx >= ZOOM_ORDER.length - 1}
          onClick={zoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* Undo / Redo */}
        {!readOnly && (
          <>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canUndo}
              onClick={onUndo}
              title="Undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!canRedo}
              onClick={onRedo}
              title="Redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
