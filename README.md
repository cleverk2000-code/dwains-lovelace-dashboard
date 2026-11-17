# 개인용 Dwains Dashboard 3.x 포크

원본 Dwains Dashboard 3.10.1에 난방 설정온도, 난방·가습기 작은 아이콘, 한글화, 재실·모션 상태 아이콘, 숨김과 상태 집계 분리 기능을 추가했습니다. Dwains Dashboard Next와는 별도 저장소입니다.

[원본 대비 상세 차이점](FORK_CHANGES.md) · [향후 업데이트/병합 가이드](UPSTREAM_UPDATE.md)

업데이트 전 검사: node scripts/fork-check.cjs verify

주의: 실제 HA에 설치되는 파일은 custom_components/dwains_dashboard/js/dwains-dashboard.js 입니다. 이 배포 JS에는 전체 한국어 번역 등 별도 수정이 포함됩니다.

---

# dwains-lovelace-dashboard

## Important Announcement

Update June 2026

Dwains Dashboard 3.10.1 has been released, and the DD3 source files are now available in this repository.

DD3 is no longer under active feature development and will slowly be phased out. Existing older issues have been closed as part of a tracker cleanup. If you still experience a bug on DD3, please retest with the latest DD3 version first and open a new issue only when it is still reproducible.

Active development continues in Dwains Dashboard Next:

https://github.com/dwainscheeren/dwains-dashboard-next

At the time of writing, Dwains Dashboard Next is still in alpha. Feature requests should be considered for Dwains Dashboard Next instead of DD 3.*

I built Dwains Dashboard as a free, open-source project in my spare time alongside my job. I remain proud of what we built together and grateful for everyone who reported bugs, requested features, and helped improve Dwains Dashboard over the years.

— Dwain


[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)

<a href="https://discord.gg/7yt64uX">
    <img src="https://img.shields.io/discord/688401603811999885" />
</a>

![GitHub stars](https://img.shields.io/github/stars/dwainscheeren/dwains-lovelace-dashboard?style=social)
![GitHub forks](https://img.shields.io/github/forks/dwainscheeren/dwains-lovelace-dashboard?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/dwainscheeren/dwains-lovelace-dashboard?style=social)
![GitHub followers](https://img.shields.io/github/followers/dwainscheeren?style=social)

<a href="https://www.youtube.com/channel/UCb2GBaLC4d0rVn9pZbYbQ9A"><img src="https://img.shields.io/badge/-YouTube-red?&style=for-the-badge&logo=youtube&logoColor=white" height=25></a>

<a href="https://www.buymeacoffee.com/FAkYvrx" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/white_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

<a href="https://www.paypal.me/dwainscheeren"><img src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button"></a>

[**How to install Dwains Dashboard**](https://dwainscheeren.github.io/dwains-lovelace-dashboard/v3/information/installation.html#installation)

![github-1 copy](https://user-images.githubusercontent.com/3868853/164969724-bda3d9ed-f86e-4f69-9583-2302ffc28bd9.jpg)
![github-2](https://user-images.githubusercontent.com/3868853/164969716-37242ed4-c2f1-4f59-9fc9-a277138033ff.jpg)
![github-3](https://user-images.githubusercontent.com/3868853/164969718-4353c600-5dff-4626-af3a-1a3f1b540332.jpg)
![github-4](https://user-images.githubusercontent.com/3868853/164969719-e40b1119-bf76-47a0-ae83-8af127fdb12f.jpg)



# Dwains Lovelace Dashboard

Hello, I am Dwain. I've been using Home Assistant for over two years now. At the end of summer 2019 I thought, "Why hasn't anybody made a dashboard yet that builds itself automatically by providing only minimum configuration info?" 

I own a web development company, and I want to give something back to the Home Assistant community. So I decided to build this dashboard and release it to the public. The result: Dwains Lovelace Dashboard.

**Install**

Want to know how to install Dwains Dashboard? Read the installation instructions here: [https://dwainscheeren.github.io/dwains-lovelace-dashboard/v3/information/installation.html](https://dwainscheeren.github.io/dwains-lovelace-dashboard/v3/information/installation.html#installation). It are only 3 steps! :)
Please note if you had previously Dwains Dashboard v1 or v2 installed you need to [follow the upgrade guide explained here](https://dwainscheeren.github.io/dwains-lovelace-dashboard/v3/information/migrate-v2-to-v3.html#migrate-from-existing-dwains-dashboard-v2-installation-to-v3).

**Want to request a new feature request?**

DD3 is no longer under active feature development. Please check [Dwains Dashboard Next](https://github.com/dwainscheeren/dwains-dashboard-next) for future feature requests.

**Support**

You can use the [thread on the Home Assistant community](https://community.home-assistant.io/t/dwains-theme-an-auto-generating-lovelace-ui-theme/168593) to ask any questions you have. 

Or join me on Dwains Dashboard Discord [Discord Server Home Assistant Addicts](https://discord.gg/7yt64uX).

**YouTube Channel**

If you like my content, then please do subscribe to my [Home Assistant YouTube channel](https://www.youtube.com/channel/UCb2GBaLC4d0rVn9pZbYbQ9A) I will start posting some more videos there soon.

**Like what you see?**

If you appreciate what I have developed, then please consider buying me a coffe or beer: [Buy me a coffee/beer](https://www.buymeacoffee.com/FAkYvrx) or [donate to my PayPal account](https://www.paypal.me/dwainscheeren).
You can also reply to [this HA thread](https://community.home-assistant.io/t/dwains-theme-an-auto-generating-lovelace-ui-theme/168593) and let everyone know how happy you are with this dashboard!

Greetings,

Dwain

**EXTRA LICENSE INFORMATION**
You are not allowed without my permission to resell, re-distribute or sell my dashboard!




