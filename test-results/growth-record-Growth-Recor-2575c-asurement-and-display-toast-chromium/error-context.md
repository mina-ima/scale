# Page snapshot

```yaml
- generic [ref=e3]:
    - heading "成長記録モード" [level=1] [ref=e4]
    - generic [ref=e5]:
        - tablist [ref=e6]:
            - tab "身長" [ref=e7]
            - tab "足" [ref=e8]
            - tab "手" [ref=e9]
            - tab "体重" [selected] [ref=e10]
        - tabpanel [ref=e11]:
            - generic [ref=e12]:
                - heading "体重入力" [level=2] [ref=e13]
                - generic [ref=e14]:
                    - generic [ref=e15]:
                        - generic [ref=e16]: '体重 (kg):'
                        - spinbutton "体重 (kg):" [active] [ref=e17]: '25.5'
                    - generic [ref=e18]:
                        - generic [ref=e19]: '日付:'
                        - textbox "日付:" [ref=e20]: 2025-10-04
                    - button "保存" [ref=e21]
```
