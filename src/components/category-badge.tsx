"use client"

import React from "react";
import { Badge } from "@/components/ui/badge";

interface CategoryBadgeProps {
  name: string;
}

export function CategoryBadge({ name }: CategoryBadgeProps) {
  return <Badge variant="secondary" className="capitalize">{name}</Badge>;
}

export default CategoryBadge;
