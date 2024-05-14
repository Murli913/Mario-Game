pipeline {
    agent any
    environment {
        // Define Docker Hub username
        DOCKER_HUB_USERNAME = 'murli9131'
    }
    
    // tools
    // {
    //  maven 'maven'
    // }
    
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
          
         stage('Test'){
            steps{
              dir('mario-back') {
                script{
                    sh 'mvn test'
                }
                }
            }
        }
        
        stage('Docker Build and Run') {
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
        
        stage('Pull Docker Image of Nodes') {
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
