pipeline {
    agent any
    environment {
       
        DOCKER_HUB_USERNAME = 'murli9131'
        SCANNER_HOME=tool 'sonar-scanner'
    }
    
    tools
    {
    jdk 'jdk17'
    nodejs 'node16'
    maven 'maven'
    }
    
    stages{
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        
        stage('Pull Git Repo'){
            steps{
                git 'https://github.com/Murli913/Mario-Game.git'
            }
        }
        stage('Making Port Avaiable') {
            steps {
                script {
                    // Stop all containers
                    sh 'docker stop $(docker ps -aq)'
                }
            }
        }
    
        
        stage('Maven Build') {
            steps {
                dir('mario-back') {
                script{
                    sh 'mvn clean install'
                }
                }
            }
          }
          
         stage('Backend-testing'){
            steps{
              dir('mario-back') {
                script{
                    sh 'mvn test'
                }
                }
            }
        }
        
         stage('Dependency Installation for Frontend'){
            steps{
              dir('mario-frontend') {
                script{
                    sh 'npm install --save-dev jest-environment-jsdom --force'
                    sh 'npm install --save-dev jest@latest ts-jest@latest --force'
                    sh 'npm install -g ts-jest --force'
                  
                }
                }
            }
        }
         stage('Frontend-testing'){
            steps{
              dir('mario-frontend/src') {
                script{
               
                    sh 'npx jest game.spec.js --testEnvironment jsdom'
                }
                }
            }
        }
        
        stage('Docker Build and Run using docker compose') {
            steps {
                script {
                   
                    sh 'docker-compose pull'
                    sh 'docker-compose build'
                }
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        
        stage('List Docker Images') {
            steps {
                script {
                    // Use Docker CLI to list images
                    sh 'docker images'
                }
            }
        }
        stage('Tag and Push Docker Images') {
            steps {
                script {
                    sh "docker tag mario_backend ${DOCKER_HUB_USERNAME}/mario_backend"
                    withCredentials([usernamePassword(credentialsId: 'docker-jenkins', usernameVariable: 'murli9131', passwordVariable: 'Murli@9131')]) {
                        sh "docker login -u 'murli9131' -p 'Murli@9131' "
                        sh "docker push ${DOCKER_HUB_USERNAME}/mario_backend"
                    }

                    // Tag and push the frontend image
                  sh "docker tag mario_frontend ${DOCKER_HUB_USERNAME}/mario_frontend"
                    withCredentials([usernamePassword(credentialsId: 'docker-jenkins', usernameVariable: 'murli9131', passwordVariable: 'Murli@9131')]) {
                        sh "docker login -u 'murli9131' -p 'Murli@9131'"
                        sh "docker push ${DOCKER_HUB_USERNAME}/mario_frontend"
                    }

                    // Tag and push the mysql image
                   sh "docker tag mysql ${DOCKER_HUB_USERNAME}/mysql"
                    withCredentials([usernamePassword(credentialsId: 'docker-jenkins', usernameVariable: 'murli9131', passwordVariable: 'Murli@9131')]) {
                        sh "docker login -u 'murli9131' -p 'Murli@9131'"
                        sh "docker push ${DOCKER_HUB_USERNAME}/mysql"
                    }
                }
            }
        }
        
        stage('OWASP FS SCAN') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        
        stage('Pull Docker Image of Nodes using ansible') {
            steps {
                ansiblePlaybook becomeUser: null, colorized: true, disableHostKeyChecking: true, inventory: './inventory',
                playbook: './docker-deploy.yml', sudoUser: null, vaultTmpPath: ''
            }
        }
        
    }
     post {
     always {
        emailext attachLog: true,
            subject: "'${currentBuild.result}'",
            body: "Project: ${env.JOB_NAME}<br/>" +
                "Build Number: ${env.BUILD_NUMBER}<br/>" +
                "URL: ${env.BUILD_URL}<br/>",
            to: 'murlitalreja913@gmail.com',
            attachmentsPattern: 'trivyfs.txt,trivyimage.txt'
        }
    }
}
