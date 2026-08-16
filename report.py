from datetime import datetime
from types_data import TYPES

def get_type_by_date(birth_date_str: str) -> int:
    date = datetime.strptime(birth_date_str, "%Y-%m-%d")
    day = date.day

    if 1 <= day <= 3: return 1
    if 4 <= day <= 6: return 2
    if 7 <= day <= 9: return 3
    if 10 <= day <= 12: return 4
    if 13 <= day <= 15: return 5
    if 16 <= day <= 18: return 6
    if 19 <= day <= 21: return 7
    if 22 <= day <= 24: return 8
    if 25 <= day <= 27: return 9
    if 28 <= day <= 29: return 10
    if day == 30: return 11
    if day == 31: return 12

def generate_report(user_name: str, birth_date_str: str) -> dict:
    t = get_type_by_date(birth_date_str)
    type_data = TYPES[t]

    report = {
        "user_data": {
            "name": user_name,
            "birth_date": birth_date_str,
            "type": t,
            "type_description": type_data["name"]
        },
        "intro": {
            "summary": type_data["summary"],
            "core_traits": type_data["core_traits"],
            "strengths": type_data["strengths"],
            "weaknesses": type_data["weaknesses"]
        }
    }

    return report

if __name__ == "__main__":
    while True:
        try:
            name = input("Введите имя: ")
            birth = input("Введите дату рождения (YYYY-MM-DD): ")
            r = generate_report(name, birth)
            print("\nТип:", r["user_data"]["type_description"])
            print("Кратко:", r["intro"]["summary"])
            break
        except ValueError:
            print("Некорректная дата. Попробуй ещё раз, в формате YYYY-MM-DD и с реальной датой.")


