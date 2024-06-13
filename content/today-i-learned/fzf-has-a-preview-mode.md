---
title: 'fzf has a preview mode'
date: '2024-06-13T00:23:25.028Z'
slug: 'fzf-has-a-preview-mode'
---

Today I learned that fzf has a preview mode. 

> _fzf is a general-purpose command-line fuzzy finder_

Now you can not only find any file using fuzzy searching on your computer but you can also
preview the contents of the file before opening it.

[fzf preview window](https://github.com/junegunn/fzf?tab=readme-ov-file#preview-window)

Here I'm calling fzf with the `--preview` flag and using `bat` to preview the contents of the file 
which gives me syntax highlighting.

```bash
 fzf --preview 'bat --color=always {}' 
```
You can see the the standard fzf search interface on the left and now on the right, we have bat displaying 
the contents of the file with syntax highlighting.


![fzf-preview.png](/blog-images/fzf-preview.png "fzf Preview")

## Alias
So now I can alias this to `fzfp` for fzf preview so I have a quick way to search and preview files.

```bash
alias fzfp='fzf --preview "bat --color=always {}"'
```



## Github Links
- [fzf](https://github.com/junegunn/fzf)

- [bat](https://github.com/sharkdp/bat)