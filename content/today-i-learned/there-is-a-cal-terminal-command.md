---
title: 'There is a cal terminal command'
date: '2025-10-23T05:02:59.980Z'
slug: 'there-is-a-cal-terminal-command'
---
Today I learned that on Mac and Linux there is a terminal command that shows a calendar
and highlights the exact date. 

> The cal utility displays a simple calendar in traditional format and ncal offers an alternative layout, more options and the date of Easter.  The new format is a little cramped but it makes a year fit on a 25x80 terminal.  If arguments are not specified, the current month is displayed. - `man cal`


You can check all the flags https://man7.org/linux/man-pages/man1/cal.1.html


Just type `cal` in your terminal and you get a nice calendar printed. 

![Calendar image](/blog-images/cal.png)

Want to see a few months? `cal -3` 

![Calendar with 3 months view](/blog-images/cal-3.png)


Always forget when easter is each year? `ncal` has got you. Never miss an easter egg again. 

```bash 
ncal -e
20 April 2025
```
