# Better Use Case Diagram Options

## Option 1: PlantUML (Best for proper UML)

### Setup

1. Install VS Code extension: **"PlantUML"** by jebbs
2. Open `UseCase-Diagram.puml`
3. Press `Alt+D` to preview

### Export to PNG

```bash
# Install PlantUML (requires Java)
choco install plantuml

# Or use online: https://www.plantuml.com/plantuml/uml/
```

---

## Option 2: Draw.io (Best for manual editing)

### Online

1. Go to [draw.io](https://app.diagrams.net/)
2. File → New → UML → Use Case Diagram
3. Use the UML shapes from left panel

### VS Code Extension

1. Install **"Draw.io Integration"** extension
2. Create a `.drawio` file
3. Edit visually in VS Code

---

## Option 3: Lucidchart (Professional)

- Go to [lucidchart.com](https://www.lucidchart.com/)
- Free tier available
- Best for team collaboration

---

## Option 4: StarUML (Desktop App)

- Download from [staruml.io](https://staruml.io/)
- Full UML support
- Export to multiple formats

---

## Quick Reference: UML Use Case Notation

| Symbol          | Meaning                            |
| --------------- | ---------------------------------- |
| 🧍 Stick Figure | Actor (user/external system)       |
| ⭕ Oval         | Use Case                           |
| ───             | Association (actor uses feature)   |
| ─ ─ ─ «include» | Included behavior (always happens) |
| ─ ─ ─ «extend»  | Extended behavior (optional)       |
| ▷───            | Generalization (inheritance)       |
| ▭ Rectangle     | System Boundary                    |

---

## Recommended Workflow

1. **For Documentation**: Use PlantUML (version controlled, text-based)
2. **For Presentations**: Use Draw.io or Lucidchart (visual, exportable)
3. **For Academic Projects**: Use StarUML (full UML compliance)
