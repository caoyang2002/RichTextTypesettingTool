"use client";

import React from "react";
import { StyleConfig } from "@/types";
import { Button } from "@/components/ui";

interface StyleEditorProps {
  config: StyleConfig;
  onChange: (updates: Partial<StyleConfig>) => void;
  onClose: () => void;
}

export function StyleEditor({ config, onChange, onClose }: StyleEditorProps) {
  const sliders = [
    {
      label: "字体大小",
      key: "fontSize" as keyof StyleConfig,
      min: 12,
      max: 24,
      unit: "px",
    },
    {
      label: "行高",
      key: "lineHeight" as keyof StyleConfig,
      min: 1.2,
      max: 2.5,
      step: 0.05,
      unit: "",
    },
  ];

  const colorPickers = [
    { label: "正文颜色", key: "fontColor" as keyof StyleConfig },
    { label: "标题颜色", key: "titleColor" as keyof StyleConfig },
    { label: "链接颜色", key: "linkColor" as keyof StyleConfig },
    { label: "代码背景", key: "codeBackground" as keyof StyleConfig },
  ];

  return (
    <div className="fixed top-15 left-0 bottom-0 w-80 bg-white border-r border-gray-200 shadow-lg p-5 overflow-auto z-50">
      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-base font-semibold">样式编辑器</h3>
        <button
          onClick={onClose}
          className="border-none bg-none cursor-pointer text-xl text-gray-600 hover:text-gray-900"
        >
          ×
        </button>
      </div>

      {sliders.map((item) => (
        <div key={String(item.key)} className="mb-5">
          <label className="block mb-2 text-sm font-medium">
            {item.label}: {config[item.key]}
            {item.unit}
          </label>
          <input
            type="range"
            min={item.min}
            max={item.max}
            step={item.step || 1}
            value={Number(config[item.key])}
            onChange={(e) =>
              onChange({ [item.key]: parseFloat(e.target.value) })
            }
            className="w-full"
          />
        </div>
      ))}

      {colorPickers.map((item) => (
        <div key={String(item.key)} className="mb-5">
          <label className="block mb-2 text-sm font-medium">{item.label}</label>
          <input
            type="color"
            value={String(config[item.key])}
            onChange={(e) => onChange({ [item.key]: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded cursor-pointer"
          />
        </div>
      ))}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="w-full"
        >
          关闭
        </Button>
      </div>
    </div>
  );
}
