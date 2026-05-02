"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  ArrowRight, 
  FlaskConical, 
  Upload,
  Plus,
} from "lucide-react"
import { useNav } from "./nav-context"

type BiomarkerStatus = "optimal" | "watch" | "attention" | "out-of-range"

interface LabEntry {
  biomarkerId: string
  value: number
  date: string
  notes?: string
  source: "demo" | "
