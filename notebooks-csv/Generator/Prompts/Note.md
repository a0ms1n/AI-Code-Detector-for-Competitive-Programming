# Prompts

- B0 (Beginner AI User)
 - No other suggestion, just prompt it to remove comments

- B1 (Beginner AI User)
 - No other suggestion, but suggest that it can write commments

- B2 (Beginner AI User)
 - No other suggestion, just make it create code (no suggestion to comment or not comment).

- V1 (Normal AI User)
 - Add CoT to make it think before code.
 - Suggest it to use #include<bits/stdc++.h> (Like Pro CP coder would do)
 - Suggest it to reduce unnecessary space/new line.

- V1.5 (Normal AI User)
 - Like V1.
 - Suggest it to use #include<bits/stdc++.h> (Like Pro CP coder would do)

- V2 (Normal AI User)
 - Like V1, but with different CoT.
 - Suggest it to use 'short variables name'

- V3 (Normal AI User)
 - Duplicate of V2, just change the Output format.

- V4 (Gean AI User)
 - Adapt from V3, Prompt them to comment code, randomly spacing/new line, write random author/date.
 - Use array instead of vector

# Config

## Gemini

Default :
 Temp : 1
 TopP : 0.95

PxsitSuggested :
 Temp : 0.8
 TopP : 0.85