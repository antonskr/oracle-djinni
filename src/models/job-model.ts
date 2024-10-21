import mongoose, { Schema, Document } from "mongoose";

// Интерфейс для типов данных
interface Job extends Document {
  id: string;
  companyName: string;
  jobTitle: string;
  jobLink: string;
  infoTags: string[];
  description: string;
}

// Определение схемы для вакансий
const JobSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true }, // Уникальный идентификатор вакансии
    companyName: { type: String, required: true }, // Название компании
    jobTitle: { type: String, required: true }, // Название вакансии
    jobLink: { type: String, required: true }, // Ссылка на вакансию
    infoTags: { type: [String], required: true }, // Массив тегов информации
    description: { type: String, required: true }, // Описание вакансии
  },
  {
    timestamps: true, // Автоматически добавляются createdAt и updatedAt
  }
);

// Экспорт модели
export const JobModel = mongoose.model<Job>("Job", JobSchema);
