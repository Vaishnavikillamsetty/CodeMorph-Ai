import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'python', name: 'Python', extension: '.py', monacoId: 'python', icon: '🐍' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts', monacoId: 'typescript', icon: '🔷' },
  { id: 'javascript', name: 'JavaScript', extension: '.js', monacoId: 'javascript', icon: '🟨' },
  { id: 'cpp', name: 'C++', extension: '.cpp', monacoId: 'cpp', icon: '⚡' },
  { id: 'c', name: 'C', extension: '.c', monacoId: 'c', icon: '🔧' },
  { id: 'java', name: 'Java', extension: '.java', monacoId: 'java', icon: '☕' },
  { id: 'csharp', name: 'C#', extension: '.cs', monacoId: 'csharp', icon: '🎯' },
  { id: 'go', name: 'Go', extension: '.go', monacoId: 'go', icon: '🐹' },
  { id: 'rust', name: 'Rust', extension: '.rs', monacoId: 'rust', icon: '🦀' },
  { id: 'php', name: 'PHP', extension: '.php', monacoId: 'php', icon: '🐘' },
  { id: 'swift', name: 'Swift', extension: '.swift', monacoId: 'swift', icon: '🍎' },
  { id: 'kotlin', name: 'Kotlin', extension: '.kt', monacoId: 'kotlin', icon: '🎯' },
  { id: 'ruby', name: 'Ruby', extension: '.rb', monacoId: 'ruby', icon: '💎' },
  { id: 'dart', name: 'Dart', extension: '.dart', monacoId: 'dart', icon: '🎯' },
  { id: 'r', name: 'R', extension: '.r', monacoId: 'r', icon: '📊' },
  { id: 'scala', name: 'Scala', extension: '.scala', monacoId: 'scala', icon: '🔴' }
];
