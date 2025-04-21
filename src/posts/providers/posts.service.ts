import { PatchPostDto } from './../dtos/patch-post.dto';
import { TagsService } from './../../tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    /**
     * Injecting postsRepository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Injecting Tags service
     */
    private readonly tagsService: TagsService,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto): Promise<Post> {
    const author: User | null = await this.usersService.findOneById(
      createPostDto.authorId,
    );
    if (!author) {
      throw new NotFoundException(
        `Author with ID ${createPostDto.authorId} not found`,
      );
    }

    const tags = await this.tagsService.findMultipleTags(
      createPostDto.tags || [],
    );

    // Create the post
    const post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    return await this.postsRepository.save(post);
  }

  /**
   * Method to find all posts
   */
  public async findAll(userId: string): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      relations: {
        metaOptions: true,
        author: true,
        // Uncomment if tags relation is needed
        // tags: true,
      },
    });

    return posts;
  }

  /**
   * Method to delete a post from the database
   */
  public async delete(id: number): Promise<{ deleted: boolean; id: number }> {
    const result = await this.postsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return { deleted: true, id };
  }

  /**
   * Method to Update a post
   */
  public async update(patchPostDto: PatchPostDto): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id: patchPostDto.id });
    if (!post) {
      throw new NotFoundException(`Post with ID ${patchPostDto.id} not found`);
    }

    const tags = await this.tagsService.findMultipleTags(
      patchPostDto.tags || [],
    );

    // Update the tags
    post.tags = tags;

    return await this.postsRepository.save(post);
  }
}
