# 원본 Dwains Dashboard 업데이트 후 포크 수정사항 유지

일반 Dwains Dashboard 3.x용 가이드 (Next 아님).

## 원칙

원본 dwainscheeren/dwains-lovelace-dashboard의 3.0 브랜치를 포크 3.0에 강제 덮어쓰지 않습니다.
검토용 upstream-sync-* 브랜치를 만들어 원본을 git merge하고, 원본 변경과 포크 변경을 모두 보존합니다.

## 간단 실행법

    git clone https://github.com/cleverk2000-code/dwains-lovelace-dashboard.git
    cd dwains-lovelace-dashboard
    git switch 3.0
    bash scripts/prepare-upstream-update.sh

충돌이 없다면 검토 브랜치에서:

    node scripts/fork-check.cjs verify
    node --check custom_components/dwains_dashboard/js/dwains-dashboard.js
    git diff 3.0 --stat

검증 완료 후 Home Assistant 실제 화면에서 설정온도, 한글화, 난방·가습기, 재실센서 on/off 아이콘, hide in area 동작을 직접 확인하고 3.0 브랜치에 PR로 병합합니다.

## 충돌이 발생하면

자동 해결하지 않습니다. 특히 설치용 webpack 압축 JS 안에 전체 한국어 번역과 아이콘/UI 수정이 있으므로 원본 JS 파일을 통째로 선택하면 안 됩니다. FORK_CHANGES.md를 보고 유지할 부분을 수동 포팅해야 합니다.

병합 후 설치 JS가 달라졌으면:

    node scripts/fork-check.cjs stamp
    node scripts/fork-check.cjs verify

stamp에 의해 const.py가 변경됐으면 함께 커밋합니다.

## GitHub 자동화

- verify-fork.yml: 코드 변경/PR 시 맞춤 기능과 설치 JS 정적 검증.
- check-upstream.yml: 매주 원본 3.0에 새 커밋이 있는지 확인해 Actions 로그에 표시.
- 자동 병합·자동 HACS 배포는 하지 않습니다. upstream webpack 구조가 바뀌면 수동 포팅/실사용 검증이 필수입니다.

원본에는 포크의 일부 배포용 JS 변경을 재빌드할 완전한 빌드 환경이 보장되지 않습니다. 충돌 자동 해결은 지원하지 않습니다.
