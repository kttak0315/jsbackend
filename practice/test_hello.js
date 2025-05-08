import http from "k6/http";

export const options = { // 테스트 옵션
  vus: 100,
  duration: "10s",
};

export default function () {
    http.get("http://localhost:8000"); // 테스트에 사용할 함수 지정
}
