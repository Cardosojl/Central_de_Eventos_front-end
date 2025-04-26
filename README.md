# Central de Eventos
[![Author](http://img.shields.io/badge/author-@Cardosojl-blue.svg)](https://www.linkedin.com/in/jorge-luiz-cardoso-215914235/) ![GitHub license](https://img.shields.io/github/license/maitraysuthar/rest-api-nodejs-mongodb.svg)

<img src="https://lh3.googleusercontent.com/pw/AP1GczNi70wQVR8BBAIQQmxvgEDyViqt8qEPBv4fWzHcMFW20CX126GOhdqk6yZzqqRm6YlNGcAudKbG43I88YxZlg7UbxQCPUCAYBzta5-fF77ced9GfACUndV7xvvlvHaJmWf2eT_SxXT6lZtcBlpLcMDC=w1000-h796-s-no?authuser=1" width="200px" />

## Descrição

A Central de Eventos é uma aplicação web desenvolvida para gerenciamento de eventos culturais em Barueri, permitindo que organizadores agendem eventos e comerciantes participem deles. A plataforma conecta organizadores, comerciantes e visitantes em um único ambiente, facilitando a realização e divulgação de eventos na cidade.

A aplicação permite que organizadores cadastrados agendem novos eventos, gerenciem seus eventos existentes e visualizem a participação de comerciantes. Os comerciantes, por sua vez, podem visualizar eventos disponíveis e solicitar participação. Os visitantes podem acessar informações sobre eventos aprovados e suas programações.

## Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **HTML5**: Estruturação das páginas
- **CSS3**: Estilização e layout responsivo
- **JavaScript (ES6+)**: Lógica de interação e comunicação com o backend
- **Fetch API**: Comunicação com o backend via requisições HTTP
- **LocalStorage**: Armazenamento de dados de autenticação do usuário
- **JWT (JSON Web Tokens)**: Autenticação e autorização de usuários

## Passo a passo para rodar o projeto localmente

### Requisitos

- Servidor Apache ou outro servidor web
- Backend da aplicação para persistência dos dados no banco de dados (https://github.com/Cardosojl/event_center)

### Instalação
Para visualização da aplicação você pode seguir os passos a seguir:
1. Clone o repositório ou baixe o arquivo ZIP do projeto
2. Extraia os arquivos para o diretório raiz do seu servidor web (ex: `/var/www/html/` para Apache)
3. Certifique-se de que o backend da aplicação esteja rodando na porta 8080
4. Acesse a aplicação através do navegador: `http://localhost`


```
Central de eventos/
├── css/
│   └── global.css              # Estilos globais da aplicação
├── index.html                  # Página inicial
├── pages/                      # Páginas da aplicação
│   ├── about/                  # Página Sobre
│   ├── home/                   # Lógica para geração do conteúdo do index
│   ├── events/                 # Listagem de eventos
│   ├── login/                  # Página de login
│   ├── myEvents/               # Eventos do organizador (organizadores)
│   ├── myParticipations/       # Participações do comerciante (comerciantes)
│   ├── scheduleEvent/          # Agendamento de eventos (organizadores)        
│   ├── sell/                   # Página de vendas/participação (comerciantes)
│   └── user/                   # Edição do perfil do usuário
├── public/                     # Recursos estáticos
│   ├── logo.png                # Logo da aplicação
│   ├── logo.svg                # Logo em formato vetorial
│   └── ...                     # Outras imagens e recursos
└── scripts/                    # Scripts JavaScript
    ├── leftbar.js              # Componente de barra lateral
    ├── navbar.js               # Componente de navegação
    ├── requests.js             # Funções de requisição ao backend
    ├── slider.js               # Componente de slider
    └── utils.js                # Funções utilitárias
```

## Endpoints e Integração com o Backend

A aplicação front-end se comunica com o backend através dos seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `http://localhost:8080/auth/signin` | Autenticação de usuários |
| PUT | `http://localhost:8080/auth/refresh/{email}` | Atualização do token de acesso |
| GET | `http://localhost:8080/public/api/event/V1?status=APPROVED` | Listagem de eventos aprovados (público) |
| GET | `http://localhost:8080/api/event/V1/byOrganizer/{id}` | Eventos de um organizador específico |
| GET | `http://localhost:8080/api/event/V1/byCurrentDate` | Eventos existentes a partir da data atual |
| GET | `http://localhost:8080/api/event_type/V1` | Tipos de eventos disponíveis |
| POST | `http://localhost:8080/api/event/V1` | Criação de um novo evento |
| DELETE | `http://localhost:8080/api/event/V1/{id}` | Cancelamento de um evento |
| PUT | `http://localhost:8080/api/event/V1/addMerchant/{eventId}` | Solicitação de participação em evento |
| PUT | `http://localhost:8080/api/event/V1/removeMerchant/{eventId}` | Cancelamento de participação em evento |

## Diagrama de Fluxo
<table>
  <tr>
    <td align="center" rowspan="2">
      <img src="https://lh3.googleusercontent.com/pw/AP1GczPFNN5svDFbbgJR7PdyeBKw2eZj54neec2V-h8u9ynxqGgYTKffEeWlrXd4khq3JphkfZbXwERWwgRKYgYSmQsW7iK5ukF7__KW6W5ZT8AhNeqk_KOI2fT6j-nw-hm0mOcKC0AQyFhIzMLf_GT5SRyx=w617-h922-s-no?authuser=1" width="400px" /><br/>
      <sub>Diagrama do Visitante</sub>
    </td>
    <td align="center">
      <img src="https://lh3.googleusercontent.com/pw/AP1GczPoISLPHKdfe1liloCL1hgopkkf-DGziBKfENwyki9RizKuxym7-eFJBm9rml3EUImT-K_wQsgHrn2q-xEIHMaQ3QV--UnoL8sFAw1SXX04xECqfm7JhtJH3HUKEKUXdfSsHQQ21qLbXG8617-T2X12=w1433-h922-s-no?authuser=1" width="550px" /><br/>
      <sub>Diagrama do Organizador</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://lh3.googleusercontent.com/pw/AP1GczP3RNOnOu5nuYCh5uUFCTLvfjphDFAehIHSs1K1r6W7Q6Yu3DOI8KJJBLdeqBK0_g2LGq6foSaC4Iv-7xuxxU3XoxEI1_Z0V2tkuLQh-k4a9rv0g42E8O42pk7ObnjslD5tK8nU-cZeUxEXNd_rteue=w1433-h922-s-no?authuser=1" width="550px" /><br/>
      <sub>Diagrama do Comerciante</sub>
    </td>
  </tr>
</table>

## Funcionalidades

### Para Organizadores
- **Agendamento de eventos**: Organizadores podem agendar novos eventos, especificando nome, tipo, data, hora e descrição.
- **Gerenciamento de eventos**: Visualização, edição e cancelamento de eventos criados.
- **Visualização de comerciantes**: Verificação de quais comerciantes solicitaram participação em seus eventos.

### Para Comerciantes
- **Participação em eventos**: Solicitação para participar de eventos disponíveis.
- **Gerenciamento de participações**: Visualização e cancelamento de participações em eventos.

### Para Visitantes
- **Visualização de eventos**: Acesso à lista de eventos aprovados e suas informações.
- **Detalhes de eventos**: Visualização de informações detalhadas sobre cada evento.

### Observações Importantes
- **Cadastro de usuários**: Não é possível realizar cadastro diretamente na plataforma. Os cadastros são controlados pelo administrador do sistema junto com a prefeitura de Barueri.
- **Aprovação de eventos**: Todos os eventos agendados passam por um processo de aprovação antes de serem publicados.
- **Autenticação**: O sistema utiliza tokens JWT para autenticação, com mecanismo de refresh token para manter a sessão do usuário.

## Considerações Finais

A Central de Eventos é uma plataforma que visa facilitar a organização e participação em eventos culturais em Barueri, promovendo a cultura local e oferecendo oportunidades para comerciantes da região. O sistema foi projetado para ser intuitivo e fácil de usar, permitindo que organizadores e comerciantes gerenciem suas atividades de forma eficiente.