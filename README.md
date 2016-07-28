# metrobh

Pre-requisitos (instalar esses dois programas)

https://www.mongodb.com/download-center#community

https://nodejs.org/en/

#Clone the repository

clone o programa no github para um diretorio no seu pc. - c:\metrobh

    Pode fazer isso via download arquivo zip

Crie um diretorio data na pasta do projeto em seu pc:

ex: c:\metrobh\data

#Executar o projeto

##acesse o diretorio bin do mongo db (via cmd prompt)

defaut path: c:\programfiles\mongodb\server\3.2\bin

entre o seguinte comando: mongod --dbpath c:\{diretorio da sua pasta data - exemplo: c:\metrobh\data} - deixe essa janela aberta

## executando o projeto

abra uma nova janela de comando e acesse a pasta onde esta o clone do projeto: 

execute o seguinte comandos:  
1 - npm install
2 - npm start

com essa janela aberta, abra o navegador e acesse o seguinte endereço: http://localhost:3000/

## para editar recomento utilizar algum programa tipo atom (o programa usa o template jade para edição do html)

http://jade-lang.com/
