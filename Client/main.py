
import requests
import matplotlib.pyplot as plt
import numpy as np

url = "http://localhost:3000/mammals"  # Alterado para mamíferos
url_login = "http://localhost:3000/user/login"

usuario_id = ""
token = ""


def login():
    titulo("Login do Usuário")

    nome = input("Nome.....: ")
    email = input("E-mail...: ")
    senha = input('Senha....: ')

    response = requests.post(url_login, json={
        "name": nome,
        "email": email,
        "passwd": senha
    })

    if response.status_code == 200:
        resposta = response.json()
        global usuario_id
        global token
        usuario_id = resposta['id']
        token = resposta['token']
        print(f"Ok! Bem-vindo {resposta['name']}")
        print(token)
    else:
        print("Erro... Não foi possível realizar login no sistema")


def inclusao():
    titulo("Inclusão de Mamíferos (Em inglês)", "=")

    if token == "":
        print("Erro... Você precisa fazer login para incluir mamíferos")
        return

    especie = input("Espécie.......: ")
    subclasse = input("Subclasse...........: ")
    habitat = input("Habitat.......: ")
    dieta = input("Dieta.........: ")

    response = requests.post(url,
                             headers={"Authorization": f"Bearer {token}"},
                             json={
                                 "species": especie,
                                 "habitat": habitat,
                                 "diet": dieta,
                                 "subclass": subclasse,
                             })

    print(response.status_code)

    if response.status_code == 201:
        mamifero = response.json()
        print(f"Ok! Mamífero cadastrado com código: {mamifero['id']}")
    else:
        print("Erro... Não foi possível incluir o mamífero")


def listagem():
    titulo("Listagem dos Mamíferos Cadastrados")

    response = requests.get(url)

    if response.status_code != 200:
        print("Erro... Não foi possível acessar a API")
        return

    mamiferos = response.json()

    print("Cód. Espécie............: Subclasse.......: Dieta:.....: Habitat........:")
    print("--------------------------------------------------------------")

    for mamifero in mamiferos:
        print(f"{mamifero['id']:4d} {mamifero['species']:20s} {mamifero['subclass']:15s} {mamifero['diet']:12s} {mamifero['habitat']:20s}")


def alteracao():
    if token == "":
        print("Erro... Você precisa fazer login para alterar mamíferos")
        return

    listagem()


    id = int(input("\nQual o código do mamífero a alterar a espécie? "))

    response = requests.get(url)
    mamiferos = response.json()

    mamifero = [x for x in mamiferos if x['id'] == id]

    if len(mamifero) == 0:
        print("Erro... Informe um código existente")
        return

    print(f"\nEspécie.: {mamifero[0]['species']}")
    print(f"Subclasse...: {mamifero[0]['subclass']}")
    print(f"Habitat.: {mamifero[0]['habitat']}")
    print(f"Dieta...: {mamifero[0]['diet']}")

    especie = input("Novo nome da espécie: ")

    response = requests.put(url+"/"+str(id),
                              headers={"Authorization": f"Bearer {token}"},
                            json={
                            "species": especie,
                            "subclass": mamifero[0]["subclass"],
                            "habitat": mamifero[0]["habitat"],
                            "diet": mamifero[0]["diet"],
                            })

    print(response.status_code)

    if response.status_code == 201:
        print("Ok! Mamífero alterado com sucesso!")
    else:
        print("Erro... Não foi possível alterar a espécie do mamífero")


def exclusao():
    if token == "":
        print("Erro... Você precisa fazer login para excluir mamíferos")
        return

    listagem()

    id = int(input("\nQual código do mamífero você deseja excluir (0: sair)? "))

    if id == 0:
        return

    response = requests.get(url)
    mamiferos = response.json()

    mamifero = [x for x in mamiferos if x['id'] == id]

    if len(mamifero) == 0:
        print("Erro... Informe um código existente")
        return

    print(f"Espécie.: {mamifero[0]['species']}")
    print(f"Habitat.: {mamifero[0]['habitat']}")
    print(f"Dieta...: {mamifero[0]['diet']}")

    confirma = input("Confirma a exclusão (S/N)? ").upper()


    if confirma == "S":
        response = requests.delete(url+"/"+str(id),
                                   headers={"Authorization": f"Bearer {token}"})

        print(response.status_code)

        if response.status_code == 201:
            mamifero = response.json()
            print("Ok! Mamífero excluído com sucesso!")
        else:
            print("Erro... Não foi possível excluir este mamífero")


# def grafico():
#     response = requests.get(url)
#
#     if response.status_code != 200:
#         print("Erro... Não foi possível acessar a API")
#         return
#
#     mamiferos = response.json()
#     labels = list(set([x['especie'] for x in mamiferos]))
#     sizes = [0] * len(labels)
#
#     for mamifero in mamiferos:
#         index = labels.index(mamifero['especie'])
#         sizes[index] += 1
#
#     fig, ax = plt.subplots(figsize=(9, 5))
#     ax.set_title('Número de Mamíferos por Espécie')
#     plt.gcf().canvas.manager.set_window_title("Gráfico por Espécie")
#     ax.pie(sizes, labels=labels)
#     plt.show()


# def grafico2():
#     response = requests.get(url)
#
#     if response.status_code != 200:
#         print("Erro... Não foi possível acessar a API")
#         return
#
#     mamiferos = response.json()
#     especies = tuple(set([x['especie'] for x in mamiferos]))
#     quant_em_perigo = [0] * len(especies)
#     quant_estaveis = [0] * len(especies)
#
#     for mamifero in mamiferos:
#         index = especies.index(mamifero['especie'])
#         if mamifero['estado_conservacao'] == 'Em Perigo':
#             quant_em_perigo[index] += 1
#         else:
#             quant_estaveis[index] += 1
#
#     tipos_quants = {
#         "Em Perigo": quant_em_perigo,
#         "Estáveis": quant_estaveis
#     }
#     width = 0.5
#
#     fig, ax = plt.subplots(figsize=(9, 5))
#     bottom = np.zeros(len(especies))
#
#     for tipo, quants in tipos_quants.items():
#         p = ax.bar(especies, quants, width, label=tipo, bottom=bottom)
#         bottom += quants
#
#     ax.set_title("Número de Mamíferos por Espécie e Conservação")
#     plt.gcf().canvas.manager.set_window_title("Gráfico por Conservação")
#     ax.legend(loc="upper left")
#
#     plt.show()


# def grafico3():
#     response = requests.get(url)
#
#     if response.status_code != 200:
#         print("Erro... Não foi possível acessar a API")
#         return
#
#     mamiferos = response.json()
#     habitos = tuple(set([x['habitat'] for x in mamiferos]))
#     quants = [0] * len(habitos)
#
#     for mamifero in mamiferos:
#         index = habitos.index(mamifero['habitat'])
#         quants[index] += 1
#
#     fig, ax = plt.subplots(figsize=(9, 5))
#
#     y_pos = [i for i in range(len(habitos))]
#
#     colors = ['blue', 'green', 'red', 'purple', 'orange', 'cyan', 'yellow']
#     ax.barh(y_pos, quants, align='center', color=colors)
#     ax.set_yticks(y_pos, labels=habitos)
#     ax.invert_yaxis()  # labels read top-to-bottom
#     ax.set_xlabel('Quantidade')
#     ax.set_title('Quantidade de Mamíferos por Habitat')
#     plt.gcf().canvas.manager.set_window_title("Gráfico por Habitat")
#
#     plt.show()


def titulo(texto, traco="-"):
    print()
    print(texto)
    print(traco*40)


# ---------------------------- Programa Principal
while True:
    titulo("Cadastro de Mamíferos")
    print("1. Login do Usuário")
    print("2. Listagem de Mamíferos")
    print("3. Inclusão de Mamíferos")
    print("4. Alteração de Espécie")
    print("5. Exclusão de Mamífero")
    print("6. Gráfico de Habitat (Pizza)")
    print("7. Gráfico de Espécies e Conservação (Colunas Empilhadas)")
    print("8. Gráfico de Habitat (Barras)")
    print("9. Finalizar")
    opcao = int(input("Opção: "))
    if opcao == 1:
        login()
    elif opcao == 2:
        listagem()
    elif opcao == 3:
        inclusao()
    elif opcao == 4:
        alteracao()
    elif opcao == 5:
        exclusao()
    # elif opcao == 6:
    #     grafico()
    # elif opcao == 7:
    #     grafico2()
    # elif opcao == 8:
    #     grafico3()
    else:
        break
