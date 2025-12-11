import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStylingAdvice = async (productName: string, productDesc: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `你是一位精通传统汉服与现代时尚混搭的资深造型师。
      
      请针对顾客刚刚选购的这条马面裙给出简短、专业的穿搭建议（100字以内）：
      商品名称: ${productName}
      商品描述: ${productDesc}
      
      建议包括：
      1. 适合搭配的上衣（如：立领对襟衫、现代衬衫、T恤等）。
      2. 适合的鞋履或配饰。
      3. 整体风格定位（如：端庄大气、日常通勤、国潮街头）。`,
    });
    return response.text || "暂时无法生成穿搭建议。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 造型师正在忙碌中，请稍后再试。";
  }
};