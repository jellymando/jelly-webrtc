## WebRTC를 이용한 화면공유 서비스 만들기 (ing)

### 기능 스펙
- socketIo
- webRTC
- Recoil
- TypeScript

### 구현할 기능들
- [x] 화면공유
- [ ] 화면 위에 그리기
- [ ] 음성 채팅

### 추가 필요 작업
- [ ] 일정 시간동안 상대방으로부터 ping이 오지 않으면 피어 연결 끊기
- [ ] 화면공유 중인지 체크하여 중복 연결 막기
- [ ] 새로고침 시 상대방 연결 끊기
- [ ] UI 마크업

### 메모
- message 주고받는 순서 
  - offer(CLIENT->VIEWER)-> answer(VIEWER->CLIENT) -> candidate(CLIENT->VIEWER) -> candidate(VIEWER->CLIENT)
