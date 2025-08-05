'use server'

import { z } from 'zod'
import {
  generateAdvancedPassword,
  type GenerateAdvancedPasswordInput,
} from '@/ai/flows/advanced-password-generator'
import {
  analyzePasswordStrength,
  type AnalyzePasswordStrengthInput,
} from '@/ai/flows/analyze-password-strength'
import {
  detectPhishing,
  type PhishingDetectionInput,
} from '@/ai/flows/phishing-detection'
import {
  monitorDarkWeb,
  type MonitorDarkWebInput,
} from '@/ai/flows/dark-web-monitoring'

export async function generatePasswordAction(
  data: GenerateAdvancedPasswordInput
) {
  try {
    const result = await generateAdvancedPassword(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Failed to generate password.' }
  }
}

export async function analyzePasswordAction(
  data: AnalyzePasswordStrengthInput
) {
  try {
    const result = await analyzePasswordStrength(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Failed to analyze password.' }
  }
}

export async function detectPhishingAction(data: PhishingDetectionInput) {
  try {
    const result = await detectPhishing(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Failed to detect phishing.' }
  }
}

export async function monitorDarkWebAction(data: MonitorDarkWebInput) {
   if (!data.apiKey) {
    return { success: false, error: 'API Key is required.' }
  }
  try {
    const result = await monitorDarkWeb(data)
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: 'Failed to monitor dark web.' }
  }
}
