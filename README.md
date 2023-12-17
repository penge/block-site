# Block Site

**Block Site** is a simple **Chrome/Firefox extension** that improves your productivity by blocking access to distracting websites as you specify.

## Icon

<img src="public/icon_128.png" width="48">

<img src="public/toolbar/light.png" width="480">
<img src="public/toolbar/dark.png" width="480">

## Usage

Click on the icon. Enter sites to block. See [Examples](#examples).

Choose how to resolve blocked: **Close Tab**, or **Show Blocked info page**.

**Blocked info page** shows what _url_ was blocked, based on which _rule_ it was blocked, and optionally a blocked count over a chosen period of time:
_All Time_, _This Month_, _This Week_, or _Today_.

### Examples

Block `example.com` **only** (`example.com/apple/` and `orange.example.com` should work):
```
example.com       # or example.com/
```

<br>

Block any page on `example.com` (including `example.com`):
```
example.com/*
```

<br>

Block any subdomain of `example.com` **only** (`example.com` should work):
```
*.example.com
```

<br>

Block any page on `example.com` where first directory starts with any 4 characters (should block `example.com/pear/` or `example.com/plum/`, but not `example.com/orange/`):
```
example.com/????/*
```

<br>

Block any page on `example.com` where first directory starts with any characters but ends with `rry` (should block `example.com/cherry/` or `example.com/strawberry/`, but not `example.com/kiwi/`):
```
example.com/*rry/
```

## Privacy notice

Block Site doesn't collect any personal information or data.
Any user settings are stored in your browser only.
