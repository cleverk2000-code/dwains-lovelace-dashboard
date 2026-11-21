# 일반 Dwains Dashboard 포크 변경 목록

기준: Dwains Dashboard 3.10.1 (dwainscheeren/dwains-lovelace-dashboard, 브랜치 3.0).
2026-11-17 최초 확인 시, 포크는 원본보다 18커밋 앞서고 0커밋 뒤처져 있었음. Next 프로젝트가 아님.

| 기능 | 포크에서 유지할 동작 | 관련 파일 |
|---|---|---|
| 외출모드 상단 표시 | `input_boolean.away_active`가 `on`일 때 사람 카드의 **바로 오른쪽**에 비행기 아이콘, 외출모드, 외출 중 상태 표시. `off`·`unknown`·`unavailable` 시 숨김. 클릭 시 헬퍼 상세 보기 | js/src/dwains-house-information-card.js, 배포용 JS |
| 난방 설정온도 | climate가 heat/idle/off 상태여도 attributes.temperature가 유효하면 (23.5°C)처럼 표시 | js/src/entity-aggregation.js, 배포용 JS |
| 난방/가습기 아이콘 | 방 카드 오른쪽의 mdi:thermostat 및 mdi:air-humidifier, 상태별 색상, 클릭 시 상세 보기 | js/src/dwains-homepage-card.js, variables.js, 배포용 JS |
| 한글화 | 전체 한국어 번역표와 한국어 강제 적용은 배포용 JS에 포함. translations.js에는 일부 보조 번역 | **js/dwains-dashboard.js**, js/src/translations.js |
| 재실/모션 | motion/occupancy/presence/moving 센서는 감지(on) 초록 #22c55e, 미감지(off) 회색 #A3A7AD 아이콘. **숫자 없음** | js/src/dwains-homepage-card.js, 배포용 JS |
| 작은 아이콘 크기·정렬 | 재실 그림만 기존 난방 아이콘의 24px 타일 안에서 0.83배로 축소. 숫자가 붙는 조명·스위치·팬 등 기존 아이콘 24px는 변경하지 않음. 재실 아이콘은 가장 아래. 재실 OFF와 난방 OFF 색상은 #A3A7AD로 통일 | js/src/dwains-homepage-card.js, 배포용 JS |
| 미재실시 표시 | 센서가 속한 방이면 off에서도 작은 아이콘 유지. 기존 on 전용 회색/숫자 배지는 제거 | js/src/dwains-homepage-card.js, 배포용 JS |
| 복도 센서 | binary_sensor.bogdo_bogdomosyeonsenseo_motion 직접 매핑. 해당 복도 카드에서 영역/hidden 여부와 무관하게 상태 인식 | js/src/dwains-homepage-card.js, 배포용 JS |
| 숨김과 집계 분리 | Hide in area로 방 안 카드를 숨겨도 상단 및 방별 상태 집계 유지 | js/src/dwains-homepage-card.js, entity-aggregation.js, dwains-house-information-card.js, 배포용 JS |
| 편집 UI | 엔티티 편집 화면의 체크박스 레이블 정렬 | js/src/dwains-edit-entity-card.js, 배포용 JS |

경로의 js/ 접두어는 custom_components/dwains_dashboard/js/를 뜻합니다.

## 반드시 보존할 내용

1. 설치용 js/dwains-dashboard.js와 js/src/ 변경사항을 함께 관리.
2. 설치 JS의 한국어 번역표와 강제 적용 부분을 원본 JS로 덮어쓰지 말 것.
3. 난방 목표온도, 상태 아이콘, 재실센서 색상/숫자 제거, Hide in area 동작을 실기기에서 재검증.
4. JavaScript가 바뀔 때 custom_components/dwains_dashboard/const.py의 FRONTEND_ASSET_REVISION도 갱신.
5. node scripts/fork-check.cjs verify 실행 (정적 검증일 뿐 실제 UI 동작 보장 아님).

원본 소스 맵(.map)은 직접 수정한 JS와 일치하지 않을 수 있음.
