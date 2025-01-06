import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entity/user";
import { Invoice } from "./schemas/invoice.schema";
import { Invoice2 } from "./entity/invoicess";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Invoice2)
    private readonly invoiceRepository: Repository<Invoice2>
  ) {}

  async findAll(): Promise<User[] | Invoice[]> {
    // return this.userRepository.find();
    return this.invoiceRepository.find();
  }

  async findOne(id: string): Promise<User | Invoice2> {
    return this.invoiceRepository.findOneBy({ id });
  }

  async create(poria: Partial<User>): Promise<User | Invoice2> {
    return this.invoiceRepository.save(poria);
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
