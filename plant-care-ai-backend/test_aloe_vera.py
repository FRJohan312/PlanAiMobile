"""
Script de prueba para verificar respuestas sobre aloe vera
"""
import requests
import json

# URL del backend
BASE_URL = "http://localhost:8000"

# Preguntas de prueba sobre aloe vera (las que mencionó el usuario)
test_questions = [
    "¿Cómo cuido el aloe vera?",
    "¿Cuándo debo regar mi aloe vera?",
    "¿Qué hago si mi aloe vera tiene hojas amarillas?"
]

print("\n" + "=" * 60)
print("PRUEBAS DE PREGUNTAS SOBRE ALOE VERA")
print("=" * 60 + "\n")

for i, question in enumerate(test_questions, 1):
    print(f"\nPregunta {i}: {question}")
    print("-" * 60)
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={"message": question, "history": []},
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                answer = data.get("response", "Sin respuesta")
                print(f"✅ Respuesta recibida ({len(answer)} caracteres):")
                print(f"\n{answer}\n")
            else:
                print(f"❌ Error: {data.get('error', 'Error desconocido')}")
        else:
            print(f"❌ Error HTTP {response.status_code}: {response.text[:200]}")
    
    except requests.exceptions.ConnectionError:
        print("❌ Error: No se puede conectar al backend")
        print("   Asegúrate de que el backend esté corriendo (python main.py)")
        break
    except requests.exceptions.Timeout:
        print("⏱️  Error: Timeout - la respuesta tardó más de 60 segundos")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

print("\n" + "=" * 60)
print("FIN DE PRUEBAS")
print("=" * 60 + "\n")
