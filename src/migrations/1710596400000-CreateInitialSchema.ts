import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1710596400000 implements MigrationInterface {
  name = 'CreateInitialSchema1710596400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // User 테이블 생성
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT NOT NULL AUTO_INCREMENT,
        githubId VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        walletAddress VARCHAR(255),
        avatarUrl VARCHAR(255),
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);

    // Wiki 테이블 생성
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS wiki (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category ENUM('LAYER_1', 'LAYER_2', 'DEFI', 'NFT', 'OTHER') NOT NULL DEFAULT 'OTHER',
        views INT NOT NULL DEFAULT 0,
        likesCount INT NOT NULL DEFAULT 0,
        author_id INT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (author_id) REFERENCES user(id)
      )
    `);

    // Like 테이블 생성
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`like\` (
        id INT NOT NULL AUTO_INCREMENT,
        userId INT NOT NULL,
        wikiId INT NOT NULL,
        isLiked BOOLEAN NOT NULL DEFAULT true,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY UK_user_wiki (userId, wikiId),
        FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (wikiId) REFERENCES wiki(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `like`');
    await queryRunner.query('DROP TABLE IF EXISTS wiki');
    await queryRunner.query('DROP TABLE IF EXISTS user');
  }
} 