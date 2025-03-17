// lib/api.js
import axios from 'axios';

const storedToken = sessionStorage.getItem("token");


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL, // API의 기본 경로 설정
  headers: {
    'Authorization': `Bearer ${storedToken}`, // 실제 토큰으로 교체
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
});

export const Agentapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AGENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'application/json'
  }
})

export default api;