# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] -
### Added
- Run ngrok when developing automatically.
- Use elasticsearch as search database.
- Fuzzy search. Let user find video easier.

## [0.2.0] - 2017-08-17
### Added
- Import circleci 2.0 as CI tool and unit test by jest.
- Use [dashbot](https://www.dashbot.io/) as our bot analytics tool.
- Start using "CHANGELOG.md" throughout the site to differentiate between the file and the purpose of the file — the logging of changes.
- Connect with image analytic server. It will post to the server when user uploads a photo.
- Use [node-mongo-seeds](https://github.com/toymachiner62/node-mongo-seeds) to inject basic data into local mongo database.

### Changed
- Replace [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api) with [toolbot-core-experiment](https://github.com/Yoctol/toolbot-core-experiment).
  Improve code quality a lot.

### Fixed
- Replace strange character in string. It will lead to posting telegram API failed.
- Fix some typo.

## 0.1.0 - 2017-07-24
### Added
- Create Telegram bot by [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api).
- Let user select language, including English and traditional Chinese.
- Before officially useing PPAV bot, user should accept disclaimer.
- Show persistent menu after accepting disclaimer, including Show disclaimer, About PPAV, Report problems, Contact us and Settings.
- Create basic video message with image, website link and page buttons.
- Auto delete bot message.
